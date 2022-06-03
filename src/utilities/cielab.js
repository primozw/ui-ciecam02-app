function xyz2lab(xyz, xyzw = [95.04300519709449, 100, 108.88064918092576]){
	var f = xyz.map(function(v, i) {
		return (v/xyzw[i] <= 0.008856 ) ? (841/108)*(v/xyzw[i])+4/29 : Math.pow(v/xyzw[i], 1/3);
	});
	return [
		(xyz[1]/xyzw[1] <= 0.008856) ? 903.3 * xyz[1]/xyzw[1] : 116*f[1]-16,
		500*(f[0]-f[1]),
		200*(f[1]-f[2])
	]
}

function lab2xyz(lab, xyzw = [95.04300519709449, 100, 108.88064918092576]){
	var Y = (lab[0] > 7.9996) ? xyzw[1]*Math.pow((lab[0] + 16)/116, 3) : xyzw[1]*lab[0]/903.3,
			fy = (Y/xyzw[1] > 0.008856) ? Math.pow(Y/xyzw[1], 1/3) : 7.787*(Y/xyzw[1])+16/116,
			X = (Math.pow(lab[1]/500 + fy, 3) > 0.008856) ? xyzw[0]*Math.pow(lab[1]/500 + fy, 3) : xyzw[0]*(lab[1]/500 + fy - 16/116)/7.787,
			Z = (Math.pow(fy - lab[2]/200, 3) > 0.008856) ? xyzw[2]*Math.pow(fy - lab[2]/200, 3) : xyzw[2]*(fy - lab[2]/200 - 16/116)/7.787;

			return [X, Y, Z];
}

export {xyz2lab, lab2xyz};
