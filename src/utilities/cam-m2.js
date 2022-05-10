import {illuminant, matrix, degree} from "ciebase";
import {cfs} from "./helpers";
import {merge} from "mout/object";
import {xyz2lab, lab2xyz} from "./cielab";

var {pow, sqrt, exp, abs, sign} = Math,
    {sin, cos, atan2} = Math;

var surrounds = {
	average: {F: 1.0, c: 0.69, N_c: 1.0},
	dim: {F: 0.9, c: 0.59, N_c: 0.9},
	dark: {F: 0.8, c: 0.535, N_c: 0.8}
};

var M_CAT02 = [
	[0.7328,  0.4296, -0.1624],
	[-0.7036, 1.6975,  0.0061],
	[0.0030,  0.0136,  0.9834]
];

var M_HPE = [
	[0.38971,  0.68898, -0.07868],
	[-0.22981, 1.18340,  0.04641],
	[0.00000,  0.00000, 1.00000]
];

var XYZ_to_CAT02 = M_CAT02,
    CAT02_to_XYZ = matrix.inverse(M_CAT02),
    CAT02_to_HPE = matrix.product(M_HPE, matrix.inverse(M_CAT02)),
    HPE_to_CAT02 = matrix.product(M_CAT02, matrix.inverse(M_HPE));

var defaultViewingConditions = {
	whitePoint: illuminant.D65,
	adaptingLuminance: 40,
	background: illuminant.D65,
	proximalField: illuminant.D65,
	surroundType: "dim",
	discounting: false
};

var defaultCorrelates = cfs("QJMCshH"),
    vitalCorrelates = cfs("JCh");

function CIECAM02m2 (viewingConditions={}, p = {lightness: -0.4, hue: -0.05}, correlates=defaultCorrelates) {
	viewingConditions = merge(defaultViewingConditions, viewingConditions);

	var XYZ_w = viewingConditions.whitePoint,
			XYZ_proximal = viewingConditions.proximalField,
			XYZ_b = viewingConditions.background,
	    L_A = viewingConditions.adaptingLuminance,
	    {F, c, N_c} = surrounds[viewingConditions.surroundType];

	var k = 1 / (5*L_A + 1),
	    F_L = 0.2 * pow(k, 4) * 5 * L_A + 0.1 * pow(1 - pow(k, 4), 2) * pow(5 * L_A, 1/3),
	    n = XYZ_b[1] / XYZ_w[1],
	    N_bb = 0.725 * pow(1/n, 0.2),
	    N_cb = N_bb,
	    z = 1.48 + sqrt(n),
	    D = viewingConditions.discounting ? 1 : F * (1 - 1 / 3.6 * exp(-(L_A + 42) / 92));
	    //console.log('D: ', D)
	
	var RGB_w = matrix.multiply(XYZ_to_CAT02, XYZ_w),
			RGB_proximal = matrix.multiply(XYZ_to_CAT02, XYZ_proximal),
			RGB_b = matrix.multiply(XYZ_to_CAT02, XYZ_b),
			RGB_w_lightness = modifyConeResponse(RGB_w, RGB_b, RGB_proximal, p.lightness),
			RGB_w_hue = modifyConeResponse(RGB_w, RGB_b, RGB_proximal, p.hue);

	//console.log('RGB_w_lightness: ', RGB_w_lightness);
	//console.log('RGB_w_hue: ', RGB_w_hue);

	function modifyConeResponse(RGB_w, RGB_b, RGB_proximal, p){
		return RGB_w.map((v, i) => {
			var P = RGB_proximal[i]/RGB_b[i];
			return (v * sqrt((1 - p)*P + (1 + p)/P)) / sqrt((1 + p)*P + (1 - p)/P)
		});
	}

	function correspondingWhite(RGB_w) {
		var [D_R, D_G, D_B] = RGB_w.map(v => D * XYZ_w[1] / v + 1 - D),
				[R, G, B] = RGB_w;
		return [D_R*R, D_G*G, D_B*B];		
	}

	function correspondingColors (XYZ, RGB_w) {
		var [R, G, B] = matrix.multiply(XYZ_to_CAT02, XYZ),
				[D_R, D_G, D_B] = RGB_w.map(v => D * XYZ_w[1] / v + 1 - D);
		return [D_R*R, D_G*G, D_B*B];
	}

	function reverseCorrespondingColors (RGB_c, RGB_w) {
		var [R_c, G_c, B_c] = RGB_c,
				[D_R, D_G, D_B] = RGB_w.map(v => D * XYZ_w[1] / v + 1 - D);
		return matrix.multiply(CAT02_to_XYZ, [R_c/D_R, G_c/D_G, B_c/D_B]);
	}

	function adaptedResponses (RGB_c) {
		return matrix.multiply(CAT02_to_HPE, RGB_c).map(function (v) {
			var x = pow(F_L * abs(v) / 100, 0.42);
			return sign(v) * 400 * x / (27.13 + x) + 0.1;
		});
	}

	function reverseAdaptedResponses (RGB_a) {
		return matrix.multiply(HPE_to_CAT02, RGB_a.map(function (v) {
			var x = v - 0.1;
			return sign(x) * 100 / F_L * pow(27.13 * abs(x) / (400 - abs(x)), 1/0.42);
		}));
	}

	function achromaticResponse (RGB_a) {
		var [R_a, G_a, B_a] = RGB_a;
		return (R_a * 2 + G_a + B_a / 20 - 0.305) * N_bb;
	}



	function fromXyz (XYZ) {
		// Compute J based od modified white for lightness parameter
		var RGB_cw = correspondingWhite( RGB_w_lightness ),
				RGB_c = correspondingColors(XYZ, RGB_w_lightness),
	    	RGB_aw = adaptedResponses(RGB_cw),
	    	RGB_a = adaptedResponses(RGB_c),
	    	A = achromaticResponse(RGB_a),
	    	A_w = achromaticResponse(RGB_aw),		    
		    J = 100 * pow(A / A_w, c * z);

		// Compute a, b, h to get C
		RGB_c = correspondingColors(XYZ, RGB_w_hue),
		RGB_a = adaptedResponses(RGB_c);

		var [R_a, G_a, B_a] = RGB_a,
				a = R_a - G_a * 12 / 11 + B_a / 11,
		    b = (R_a + G_a - 2 * B_a) / 9,
		    h_rad = atan2(b, a),
		    h = degree.fromRadian(h_rad),
		    e_t = 1/4 * (cos(h_rad + 2) + 3.8),
		    t = (5e4 / 13 * N_c * N_cb * e_t * sqrt(a*a + b*b) / (R_a + G_a + 21 / 20 * B_a)),
		    C = pow(t, 0.9) * sqrt(J / 100) * pow(1.64 - pow(0.29, n), 0.73);

		return {
			J: J,
			C: C,
			h: h
		};
	}

	function getXyz(CAM, RGB_w){
		var RGB_cw = correspondingWhite( RGB_w ),
				RGB_aw = adaptedResponses(RGB_cw),
				A_w = achromaticResponse(RGB_aw);

		var {J, C, h} = (CAM),
		    h_rad = degree.toRadian(h),
		    t = pow(C / (sqrt(J / 100) * pow(1.64 - pow(0.29, n), 0.73)), 10 / 9),
		    e_t = 1 / 4 * (cos(h_rad + 2) + 3.8),
		    A = A_w * pow(J / 100, 1 / c / z);

		var p_1 = 5e4 / 13 * N_c * N_cb * e_t / t,
		    p_2 = A / N_bb + 0.305,
		    q_1 = p_2 * 61/20 * 460/1403,
		    q_2 = 61/20 * 220/1403,
		    q_3 = 21/20 * 6300/1403 - 27/1403;

		var sin_h = sin(h_rad),
		    cos_h = cos(h_rad);

		var a, b;

		if (t === 0 || isNaN(t)) {
			a = b = 0;
		} else if (abs(sin_h) >= abs(cos_h)) {
			b = q_1 / (p_1 / sin_h + q_2 * cos_h / sin_h + q_3);
			a = b * cos_h / sin_h;
		} else {
			a = q_1 / (p_1 / cos_h + q_2 + q_3 * sin_h / cos_h);
			b = a * sin_h / cos_h;
		}

		var RGB_a = [
			20/61 * p_2 + 451/1403 * a +  288/1403 * b,
			20/61 * p_2 - 891/1403 * a -  261/1403 * b,
			20/61 * p_2 - 220/1403 * a - 6300/1403 * b
		];

		var RGB_c = reverseAdaptedResponses(RGB_a),
		    XYZ = reverseCorrespondingColors(RGB_c, RGB_w);

		return XYZ;
	}

	function toXyz (CAM) {
		var primeXYZ = getXyz(CAM, RGB_w_lightness),
				doublePrimeXYZ = getXyz(CAM, RGB_w_hue),
				labPrime = xyz2lab(primeXYZ, XYZ_w),
				labDoublePrime = xyz2lab(doublePrimeXYZ, XYZ_w),
				xyz = lab2xyz([labPrime[0], labDoublePrime[1], labDoublePrime[2]]);

		//console.log('Prime XYZ:', primeXYZ);
		//console.log('DoublePrime XYZ:',doublePrimeXYZ);
		//console.log('Prime LAB:', labPrime);
		//console.log('DoublePrime LAB', labDoublePrime);

		return xyz;
	}

	return {fromXyz, toXyz};
}

export default CIECAM02m2;
