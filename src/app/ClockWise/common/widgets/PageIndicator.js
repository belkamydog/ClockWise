import { createWidget, widget, prop } from '@zos/ui'
import { styleColors } from '../../utils/Constants'

export class PageIndicator {
    background = null
    indicator = null
    pageLength = 0

    constructor(pageLength){
        this.pageLength = pageLength
        const deltaAngles = 60 / pageLength
        const startAngle = -30
        this.background = createWidget(widget.ARC, {
            x: -10,
            y: 0,
            w: 480,
            h: 480,
            start_angle: -30,
            end_angle: 30,
            color: styleColors.dim_gray,
            line_width: 10
        })
        this.indicator = createWidget(widget.ARC, {
            x: -10,
            y: 0,
            w: 480,
            h: 480,
            start_angle: startAngle,
            end_angle: startAngle + deltaAngles,
            color: styleColors.white_smoke,
            line_width: 10
        })
    }

    updatePageIndicator(index){
        const deltaAngles = 60 / this.pageLength
        let startAngle = index * deltaAngles - 30
        let endAngle = startAngle + deltaAngles
        this.indicator.setProperty(prop.MORE, {
            start_angle: startAngle,
            end_angle: endAngle
        })
    }

    getIndicator(){ return this.indicator }
    getBackground(){ return this.background }
    
}