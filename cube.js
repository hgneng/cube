var cube = (function() {
	var faces = {
			'front': null,
			'right': null,
			'back': null,
			'left': null,
			'up': null,
			'bottom': null,
		},
		colors = [],
		cubeSize = 200,
		style = 'cool',//风格,
		cubeWrapEle = null;
		rotateFloorRotating = false,
		animateGapTime = 1000;
		rotateFloorData = {
			'sizeEdges':[],
			'faceUp': null,
			'faceBottom': null
		},//准备给旋转层的数据
		newSetFloorData = {
			'sizeEdges':[],//每一边数据形式{faceType:'',colOrRow: '', floorNum:'', floorData:[]}
			'faceUp': {'faceType':'', 'faceData':[]},//当次旋转不涉及顶面则null
			'faceBottom': {'faceType':'', 'faceData':[]}////当次旋转不涉及底面则null
		},//准备设置旋转之后的数据
		cube = {};

	cube.faces = faces;

	function init() {
		cubeWrapEle = document.getElementById('cubeWrap');
		for (var type in faces) {
			faces[type] = new Face(type);
			cubeWrapEle.appendChild(faces[type].getFaceEle());
		}
		reset();
	}

	function reset() {
		cubeWrapEle.className = 'cube-ani ' + style;
		cubeWrapEle.style.width = cubeSize + 'px';
		cubeWrapEle.style.height = cubeSize + 'px';
		cubeWrapEle.style.marginLeft = -(cubeSize / 2) + 'px';
		cubeWrapEle.style.marginTop = -(cubeSize / 2) + 'px';

		floor.reset();

		for (var faceType in faces) {
			faces[faceType].reset();
			faces[faceType].faceEle.style.transform = faces[faceType].faceEle.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
		}		
	}


	cube.setSize = function(_cubeSize) {
		cubeSize = _cubeSize;
		reset();
	}
	
	cube.setColNum = function(_colNum) {
		cube_floor_num = _colNum;
		reset();
	}

	cube.setStyle = function(_style) {
		style = _style;
		reset();
	}


/*		rotateFloorData = {
			'floorNum': 0,
			'sizeEdges':[],
			'faceUp': null,
			'faceBottom': null
		},//准备给旋转层的数据
		newSetFloorData = {
			'floorNum': 0,
			'sizeEdges':[],//每一边数据形式{faceType:'', floorData:[]}
			'faceUp': {'faceType':'', 'faceData':[]},//当次旋转不涉及顶面则null
			'faceBottom': {'faceType':'', 'faceData':[]}////当次旋转不涉及底面则null
		},//准备设置旋转之后的数据*/
	cube.rotate = function(rotateType, dir, floorNum, durTime, ani, successCallback) {
		//console.log(rotateType, dir, floorNum);
		if (rotateFloorRotating) {
			return;
		} else {
			rotateFloorRotating = true;
		}

		var rotateDirObj = rotateDir[rotateType];


		/*-------------组织好要旋转的数据------------*/
		rotateFloorData = {
			'sizeEdges':[],
			'faceUp': null,
			'faceBottom': null
		};//准备给旋转层的数据
		newSetFloorData = {
			'sizeEdges':[],//每一边数据形式{faceType:'',colOrRow: '', floorNum:'', floorData:[]}
			'faceUp': {'faceType':'', 'faceData':[]},//当次旋转不涉及顶面则null
			'faceBottom': {'faceType':'', 'faceData':[]}////当次旋转不涉及底面则null
		};//准备设置旋转之后的数据

		rotateFloorData.floorNum = floorNum;
		//四边的数据
		for (var i = 0; i < 4; i++) {
			rotateFloorData.sizeEdges[i] = {};
			//rotateFloorData.sizeEdges[i] = faces[rotateDirObj.sizeEdges[i].face].getFloorData(rotateType, floorNum);
			rotateFloorData.sizeEdges[i].faceType = rotateDirObj.sizeEdges[i].face;
			rotateFloorData.sizeEdges[i].floorData = faces[rotateDirObj.sizeEdges[i].face].getFloorData(rotateType, floorNum);

			//旋转后的facetype也顺便在这里赋值
			newSetFloorData.sizeEdges[i] = {};
			newSetFloorData.sizeEdges[i].faceType = rotateFloorData.sizeEdges[i].faceType;
		}

		//判断是否要上下面数据
		rotateFloorData.faceUp = null;
		rotateFloorData.faceBottom = null;
		if (floorNum == cube_floor_num - 1) {//需要顶面数据
			rotateFloorData.faceUp = {};
			rotateFloorData.faceUp.faceType = rotateDirObj.faceUp.face;//上层面类型
			rotateFloorData.faceUp.faceData = rotateSquareArr(faces[rotateDirObj.faceUp.face].getFaceData(), 1, rotateDirObj.faceUp.rotateDegree);//上层面数据
		} else if (floorNum == 0) {
			rotateFloorData.faceBottom = {};
			rotateFloorData.faceBottom.faceType = rotateDirObj.faceBottom.face;//下层面类型
			rotateFloorData.faceBottom.faceData = rotateSquareArr(faces[rotateDirObj.faceBottom.face].getFaceData(), 1, rotateDirObj.faceBottom.rotateDegree);//下层面数据
		}


		/* 旋转后会变成的数据 */
		var newIndex = (dir == 1 ? 1 : 3);
		for (var i = 0 ; i < 4; i++) {
			newSetFloorData.sizeEdges[newIndex].floorData = rotateFloorData.sizeEdges[i].floorData;
			newIndex = (++newIndex % 4);
		}
		newSetFloorData.faceUp = null;
		newSetFloorData.faceBottom = null;
		if (rotateFloorData.faceUp) {
			newSetFloorData.faceUp = {};
			newSetFloorData.faceUp.faceType = rotateDirObj.faceUp.face;
			newSetFloorData.faceUp.faceData = rotateSquareArr(rotateFloorData.faceUp.faceData, dir, 1);
		} 
		if (rotateFloorData.faceBottom) {
			newSetFloorData.faceBottom = {};
			newSetFloorData.faceBottom.faceType = rotateDirObj.faceBottom.face;
			if (newSetFloorData.faceBottom.faceType == 'up') {
				newSetFloorData.faceBottom.faceData = rotateSquareArr(rotateFloorData.faceBottom.faceData, dir, 1);
			} else {
				newSetFloorData.faceBottom.faceData = rotateSquareArr(rotateFloorData.faceBottom.faceData, -1 *dir, 1);
			}
		}	

		// 将新的魔方数据设置魔方的函数
		function setData() {

			for (var i = 0; i < 4; i++) {
				faces[newSetFloorData.sizeEdges[i].faceType].setFloorData(rotateType, floorNum, newSetFloorData.sizeEdges[i].floorData);
			}

			newSetFloorData.faceUp && faces[newSetFloorData.faceUp.faceType].setFaceData(newSetFloorData.faceUp.faceData);
			newSetFloorData.faceBottom && faces[newSetFloorData.faceBottom.faceType].setFaceData(newSetFloorData.faceBottom.faceData);

			// 判断是否胜利
			var success = true;
			// 如果每一面Face里所有Block的type都一样，就表示每一面颜色都相同。
			for (var faceType in faces) {
				success = (success && faces[faceType].isAllSame());
			}		
			if (success) {successCallback();}	
		}

		if (ani) { // 需要动画
			floor.rotate(rotateType, floorNum, rotateFloorData, dir, durTime, function() {rotateFloorRotating = false;
				setData();
			});
		} else {
			rotateFloorRotating = false;
			setData();
		}

	}

	// 整体旋转
	cube.rotateAll = function(rotateType, dir) {
		if (rotateFloorRotating) {
			return;
		} else {
			rotateFloorRotating = true;
		}

		var rotateDirObj = rotateDir[rotateType];

		/*-------------组织好要旋转的数据------------*/
		rotateFloorData = {
			'sizeEdges':[],
			'faceUp': null,
			'faceBottom': null
		}; // 准备给旋转层的数据
		newSetFloorData = {
			'sizeEdges':[],//每一边数据形式{faceType:'',colOrRow: '', floorNum:'', floorData:[]}
			'faceUp': {'faceType':'', 'faceData':[]},//当次旋转不涉及顶面则null
			'faceBottom': {'faceType':'', 'faceData':[]}////当次旋转不涉及底面则null
		}; // 准备设置旋转之后的数据

		for (let floorNum = 0; floorNum < cube_floor_num; floorNum++) {
			rotateFloorData.floorNum = floorNum;
			// 四边的数据
			for (var i = 0; i < 4; i++) {
				rotateFloorData.sizeEdges[i] = {};
				//rotateFloorData.sizeEdges[i] = faces[rotateDirObj.sizeEdges[i].face].getFloorData(rotateType, floorNum);
				rotateFloorData.sizeEdges[i].faceType = rotateDirObj.sizeEdges[i].face;
				rotateFloorData.sizeEdges[i].floorData = faces[rotateDirObj.sizeEdges[i].face].getFloorData(rotateType, floorNum);

				// 旋转后的facetype也顺便在这里赋值
				newSetFloorData.sizeEdges[i] = {};
				newSetFloorData.sizeEdges[i].faceType = rotateFloorData.sizeEdges[i].faceType;
			}

			// 判断是否要上下面数据
			rotateFloorData.faceUp = null;
			rotateFloorData.faceBottom = null;
			if (floorNum == cube_floor_num - 1) { // 需要顶面数据
				rotateFloorData.faceUp = {};
				rotateFloorData.faceUp.faceType = rotateDirObj.faceUp.face; // 上层面类型
				rotateFloorData.faceUp.faceData = rotateSquareArr(faces[rotateDirObj.faceUp.face].getFaceData(), 1, rotateDirObj.faceUp.rotateDegree);//上层面数据
			} else if (floorNum == 0) {
				rotateFloorData.faceBottom = {};
				rotateFloorData.faceBottom.faceType = rotateDirObj.faceBottom.face;//下层面类型
				rotateFloorData.faceBottom.faceData = rotateSquareArr(faces[rotateDirObj.faceBottom.face].getFaceData(), 1, rotateDirObj.faceBottom.rotateDegree);//下层面数据
			}

			/* 旋转后会变成的数据 */
			var newIndex = (dir == 1 ? 1 : 3);
			for (var i = 0 ; i < 4; i++) {
				newSetFloorData.sizeEdges[newIndex].floorData = rotateFloorData.sizeEdges[i].floorData;
				newIndex = (++newIndex % 4);
			}
			newSetFloorData.faceUp = null;
			newSetFloorData.faceBottom = null;
			if (rotateFloorData.faceUp) {
				newSetFloorData.faceUp = {};
				newSetFloorData.faceUp.faceType = rotateDirObj.faceUp.face;
				newSetFloorData.faceUp.faceData = rotateSquareArr(rotateFloorData.faceUp.faceData, dir, 1);
			} 
			if (rotateFloorData.faceBottom) {
				newSetFloorData.faceBottom = {};
				newSetFloorData.faceBottom.faceType = rotateDirObj.faceBottom.face;
				if (newSetFloorData.faceBottom.faceType == 'up') {
					newSetFloorData.faceBottom.faceData = rotateSquareArr(rotateFloorData.faceBottom.faceData, dir, 1);
				} else {
					newSetFloorData.faceBottom.faceData = rotateSquareArr(rotateFloorData.faceBottom.faceData, -1 *dir, 1);
				}
			}	

			// 将新的魔方数据设置魔方的函数
			for (var i = 0; i < 4; i++) {
				faces[newSetFloorData.sizeEdges[i].faceType].setFloorData(rotateType, floorNum, newSetFloorData.sizeEdges[i].floorData);
			}

			newSetFloorData.faceUp && faces[newSetFloorData.faceUp.faceType].setFaceData(newSetFloorData.faceUp.faceData);
			newSetFloorData.faceBottom && faces[newSetFloorData.faceBottom.faceType].setFaceData(newSetFloorData.faceBottom.faceData);
		}

		rotateFloorRotating = false;
	}

	cube.reset = function(_cubeSize, _colNum, _style) {
		cubeSize = _cubeSize ? _cobeSize : cubeSize;
		cube_floor_num = _colNum ? _colNum : cube_floor_num;
		style = _style ? _style : style;
		reset();
	}

	cube.getCurrentCubeSize = function() {
		return cubeSize;
	}

	let typeCodes = {
		'front': 0,
		'right': 1,
		'back': 2,
		'left': 3,
		'up': 4,
		'bottom': 5
	};

	// 计算24种整体旋转态的状态值，取最小的一种作为特征状态值。
	cube.computeUniqueStateCode = function() {
		let stateCode = cube.computeStateCode();
		let uniqueStateCode = stateCode;

		let rotations = [
			// 白前红右
			['x', -1], // 蓝前红右
			['x', -1], // 黄前红右
			['x', -1], // 绿前红右
			['y', -1], // 红前蓝右
			['x', -1], // 白前蓝右
			['x', -1], // 橙前蓝右
			['x', -1], // 黄前蓝右
			['y', -1], // 蓝前白右
			['x', -1], // 红前白右
			['x', -1], // 绿前白右
			['x', -1], // 橙前白右
			['y', -2], // 红前黄右
			['x', -1], // 蓝前黄右
			['x', -1], // 橙前黄右
			['x', -1], // 绿前黄右
			['z', -1], // 绿前橙右
			['x', -1], // 黄前橙右
			['x', -1], // 蓝前橙右
			['x', -1], // 白前橙右
			['z', 1],  // 白前绿右
			['x', -1], // 红前绿右
			['x', -1], // 黄前绿右
			['x', -1], // 橙前绿右
		];

		for (let i = 0; i < 23; i++) {
			cube.rotateAll(rotations[i][0], rotations[i][1]);
			stateCode = cube.computeStateCode();
			if (stateCode < uniqueStateCode) {
				uniqueStateCode = stateCode;
			}
		}

		return uniqueStateCode;
	},

	// 计算魔方当前状态值，返回值是一个整数数组，表示一个很大的整数。
	cube.computeStateCode = function() {
		let code = BigInt(0);
		for (let type in faces) {
			for (let i = 0; i < cube_floor_num; i++) {
				for (let j = 0; j < cube_floor_num; j++) {
					let blockCode = typeCodes[faces[type].blocks[i][j].type];
					code = code * BigInt(6) + BigInt(blockCode);
				}
			}
		}

		return code;
	}

	init();
	return cube;
})();


//cubeHandler
var cubeHandler = (function(cube) {
	var handler = {},
		cube = cube,
		lock = false,//游戏已经开始，任何设置魔方的动作（行列风格），不允许
		motions = [],//已经旋转的每一次动作
		redoMotions = [],//已撤销的动作
		cubeWrapEle = document.getElementById('cubeWrap'),
		cubeOptWrap = document.getElementById('cubeOptWrap'),
		cubePlayingOptWrap = document.getElementById('optPlayingWrap');

	function init() {
		gamer.registerStart(startCube);
		gamer.registerReset(resetCube);
		initEvent();
	}


	function initEvent() {
		//设置魔方，最好把在block.js 的旋转命令拿过来
		cubeWrapEle.onclick = function(e) {
			if (!lock) {
				return;
			}
			var target = e.target;

			if (target.className.indexOf('arrow') != -1) {

				var rotateInfo = target.getAttribute('alt').split(',');
				handRotateCube(rotateInfo[0], rotateInfo[1], rotateInfo[2], 500, true);
			}
		}

		//魔方大小
		cubeOptWrap.onclick = function(e) {
			if (lock) {
				return;
			}

			var target = e.target;

			switch (target.id) {
				//大小
				case 'optSizeSmall':
					cube.setSize(150);
					break; 
				case 'optSizeMedium': 
					cube.setSize(200);
					break; 
				case 'optSizeLarge': 
					cube.setSize(250);
					break; 	

				//列数
				case 'optCol2':
					cube.setColNum(2);
					break; 
				case 'optCol3': 
					cube.setColNum(3);
					break; 
				case 'optCol4': 
					cube.setColNum(4);
					break; 	

				case 'optCol5': 
					cube.setColNum(5);
					break; 
				case 'optCol6': 
					cube.setColNum(6);
					break; 	

				//风格

				case 'optStyleCool':
					cube.setStyle('cool');
					break; 
				case 'optStylePopular': 
					cube.setStyle('popular');
					break; 
				case 'optStylePretty': 
					cube.setStyle('pretty');
					break; 	
			}
		}

		//撤销
		cubePlayingOptWrap.onclick  = function(e) {
			if (!lock) {
				return;
			}

			var target = e.target;

			switch (target.id) {
				//大小
				case 'undo':
					undo();
					break; 
				case 'redo': 
					redo();
					break; 
			}
		}

	}


	function startRotateAnimate() {
		cubeWrapEle.className +=  ' cube-ani';
		cubeWrapEle.style.transition = 'all 1s';
	}


	function stopRotateAnimate() {
		cubeWrapEle.className = cubeWrapEle.className.replace('cube-ani', '');
		cubeWrapEle.style.transform = 'rotateX(0deg) rotateY(0deg)';
		cubeWrapEle.style.transition = '';
	}
	cube.stopRotateAnimate = stopRotateAnimate;

	function startCube() {
		//随机转魔方
		var randomRotateNum = cube_floor_num * 30,//随机转多少下
			gapTime = 40,//两次随机转间隔时间
			rotateTypes = ['x','y','z'];

		(function() {
			if (randomRotateNum <= 0) {
				lock = true;
				stopRotateAnimate();
				return;
			} else {
				var rotateType = rotateTypes[parseInt(Math.random() * 3)],
					dir = (Math.random() > 0.5 ? 1 : -1),
					floorNum = parseInt(Math.random() * cube_floor_num);

				cube.rotate(rotateType, dir, floorNum, 0, false);//随机转魔方不需要动画
				randomRotateNum--;
				setTimeout(arguments.callee, gapTime);
			}
		})();

		cubeOptWrap.style.bottom = '-200px';
		cubePlayingOptWrap.style.top = 0;
	}

	function resetCube() {
		//重置魔方
		motions = [];
		redoMotions = [];
		lock = false;
		startRotateAnimate();
		cubeOptWrap.style.bottom = '0px';
		cubePlayingOptWrap.style.top = '-200px';
		cube.reset();
	}

	//手动旋转 ，记录动作
	function handRotateCube(rotateType, dir, floorNum, durTime, ani) {
		motions.push([rotateType, dir, floorNum]);//记录动作，以作撤销用
		redoMotions = [];//手操作一次就没有redo了
		rotateCube(rotateType, dir, floorNum, durTime, ani);
	}

	//撤销
	function undo() {
		if (motions.length == 0) return;
		var undoData = motions.pop();
		redoMotions.push(undoData);
		rotateCube(undoData[0], -parseInt(undoData[1]), undoData[2], 500, true);	
	}

	//redo 
	function redo() {
		if (redoMotions.length == 0) return;
		var redoData = redoMotions.pop();
		motions.push(redoData);
		rotateCube(redoData[0], redoData[1], redoData[2], 500, true);	
	}

	function rotateCube(rotateType, dir, floorNum, durTime, ani) {
		cube.rotate(rotateType, dir, floorNum, durTime, ani, function() {
			//胜利
			lock = false;
			startRotateAnimate();
			gamer.success();
		});
	}


	init();

	return handler;
})(cube);