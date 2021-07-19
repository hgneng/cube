# cube
A game of magic cube. using css3 and js.


click to preview

[cube.html](http://htmlpreview.github.io/?https://github.com/zhzhchwin/cube/blob/master/cube.html)

数据结构说明：
* 标准色的定义是：front蓝色、back绿色、right红色、left橙色、up黄色、bottom白色
* Face表示一个面，face有up、down、left、right、front、back类型
* 每一个Face面有一个Block数组
* Block有一type类型表示它原本属于哪个面（相当于颜色），belongFaceType则表示该Block当前属于哪个面
* CSS的坐标系中，x向右，y向下，z向前。左手拇指指向坐标轴方向，四指旋转方向为顺时针。
* 旋转类型rotateType分x、y、z
* 每个块有一个旋转控件，控件包含上、下、左、右4个方向键。每个方向键有一个alt的HTML属性，里面记录了3个参数，分别代表：绕哪个轴（x、y、z）旋转，旋转的方向（1、-1表示顺时针或逆时针），对第几层做旋转
* front面顺时针旋转：cube.rotate('z', 1, 2, 500, true, null);
* cube_floor_num或colNum表示魔方阶数
* 旋转的种类有：轴向数3 * 顺逆时针转向数2 * 阶数。二级有12种转法，三阶有18种转法。
* JS中据说最大的整数是2^53 = 9,007,199,254,740,992 > 6^20。如果把魔方每一块颜色编码，整个魔方看作是一个6进制数序列。黄色0，蓝色1，红色2，绿色3，橙色4，白色5。对于2阶魔方，状态值是一个6^24的数（理论上如果以色块作为单位，而不是色片作为单位，应该是6^8）；对于3阶魔方，状态值是一个6^54（以块为单位的话是6^26）的数。
* 通过整体旋转，可以产生24种重复的状态。哪种状态值最小，作为记录（用作比较）的最终状态值。