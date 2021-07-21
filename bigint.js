// @TODO: deprecated. use buildin BigInt instead.
Bigint = {
	// compare int array in low byte first order
	// return 1 for a > b, 0 for a = b, -1 for a < b
	compare: function(a, b) {
		if (a.length > b.length) {
			return 1;
		}

		// low byte first
		for (let i = a.length - 1; i >= 0; i--) {
			if (a[i] > b[i]) {
				return 1;
			} else if (a[i] < b[i]) {
				return -1;
			}
		}

		return 0;
	}
};