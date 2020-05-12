const pixelSize = ({columns, rows, width, height}) => {
	let wrapper = Math.min(width, height)
	let grid = Math.max(columns, rows)
	return Math.floor(wrapper/grid)
}
class Cell{
	constructor(x, y, color, boxSize, ctx){
		this.color = color
		this.renderX = x
		this.renderY = y
		this.x = x / boxSize
		this.y = y / boxSize
		this.boxSize = boxSize
		this.ctx = ctx
	}
	match(x, y){
		return this.x == x && this.y == y
	}
	render(color){
		let ctx = this.ctx
		this.color = color || this.color
		ctx.fillStyle = this.color
		ctx.fillRect(this.renderX, this.renderY, this.boxSize, this.boxSize)
	}
}
class Table{
	constructor({ target, rows, columns, background, borderWidth, borderColor, boxSize, width, height }){
		this.target = target
		this.size = {
			width: width || target.offsetWidth || 400,
			height: height || target.offsetHeight || 400,
			rows,
			columns
		}
		this.size.boxSize = pixelSize(this.size)

		this.detail = {
			background,
			borderWidth,
			borderColor
		}
		this.grid = []
		this.initialize(this.size, this.detail)

	}
	boundary(x, y){
		return 
			x < this.size.columns - this.size.boxSize 
			&& x >= 0 
			&& y < this.rows - this.size.boxSize
			&& y >= 0
	}
	getPoint(x, y){
		for(let item of this.grid){
			if(item.match(x, y)) return item
		}
		return false
	}
	plot(x, y, color){
		let point = this.getPoint(x, y)
		if(point){
			point.render(color)
		}
	}
	refreshGrid(){
		this.drawGrid(true)
		for(let item of this.grid){
			item.render()
		}
	}
	background(){
		let ctx = this.ctx
		ctx.fillStyle = this.detail.background
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}
	initialize({width, height}, {borderWidth, borderColor}){
		let canvas = document.createElement('canvas')
		Object.assign(canvas, {
			width,
			height
		})
		canvas.style.border = `${borderWidth}px solid ${borderColor}`
		
		this.target.appendChild(canvas)
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')
		
		this.drawGrid()
	}
	drawGrid(refresh){
		this.background()
		let ctx = this.ctx,
			canvas = this.canvas

		for(let x = 0; x <= canvas.width; x += this.size.boxSize){
			ctx.moveTo(x, 0)
			ctx.lineTo(x, canvas.height)
			for(let y = 0; y <= canvas.height; y += this.size.boxSize){
				ctx.moveTo(0, y)
				ctx.lineTo(canvas.width, y)
				if(x % this.size.boxSize == 0){
					if(!refresh){
						this.grid.push(
							new Cell(x, y, this.detail.background,this.size.boxSize, this.ctx)
						)	
					}
					
				}
			}
		}
		ctx.stroke()
	}

}
let table = new Table({
	target: document.getElementById('display'),
	rows: 20,
	columns: 20,
	width: 400,
	height: 400,
	borderWidth: 1,
	borderColor: 'black',
	background: 'white',
})
table.plot(1,2,'black')