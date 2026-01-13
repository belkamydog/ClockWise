import { getText } from '@zos/i18n'
import { widget, createWidget, deleteWidget, align, event, prop} from '@zos/ui'
import { MONTH, styleColors } from '../utils/Constants'
import { push } from '@zos/router'

Page({
    widgets: {
        month:{
            border: null,
            data: null,
            prev: null,
            next: null,
        },
        year:{
            border: null,
            data: null,
            prev: null,
            next: null,
        },
        daysGroup: null,
        days: []
    },
    data:{
        month: 0,
        year: new Date().getFullYear()
    },

    renderMonth(){
        this.widgets.month.border = createWidget(widget.STROKE_RECT, {
            x: (480-250)/2,
            y: 35,
            w: 250,
            h: 70,
            radius: 20,
            line_width: 1,
            color: 0x230ee7
        })
        this.widgets.month.data = createWidget(widget.TEXT, {
            x: (480-250)/2,
            y: 35,
            w: 250,
            h: 70,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            text_size: 30,
            text: getText(MONTH[this.data.month]),
        })
        this.widgets.month.prev = createWidget(widget.BUTTON, {
            x: (480 - 40) / 2 - 100,
            y: 38,
            w: 40,
            h: 60,
            radius: 12,
            color:  0x230ee7,
            text: '<',
            text_size: 30,
            click_func: () => {
                if (this.data.month == 0) {
                    if (this.data.year >= new Date().getFullYear()-3)
                        this.data.year--
                    this.widgets.year.data.setProperty(prop.TEXT, this.data.year.toString())
                }
                this.data.month = (--this.data.month % 12 + 12) % 12
                this.widgets.month.data.setProperty(prop.TEXT, getText(MONTH[this.data.month]))
                this.renderDays(this.data.month, this.data.year)
            }
        })
        this.widgets.month.next = createWidget(widget.BUTTON, {
            x: (480 - 40) / 2 + 100,
            y: 38,
            w: 40,
            h: 60,
            radius: 12,
            color:  0x230ee7,
            text: '>',
            text_size: 30,
            click_func: () => {
                if (this.data.month == 11) {
                    if (this.data.year >= new Date().getFullYear()-3)
                        this.data.year++
                    this.widgets.year.data.setProperty(prop.TEXT, this.data.year.toString())
                }
                this.data.month += 1
                this.data.month = (this.data.month % 12 + 12) % 12
                this.widgets.month.data.setProperty(prop.TEXT, getText(MONTH[this.data.month]))
                this.renderDays(this.data.month, this.data.year)
            }
        })        
    },
    renderYear(){
        this.widgets.year.border = createWidget(widget.STROKE_RECT, {
            x: (480-250)/2,
            y: 480 - 120+15,
            w: 250,
            h: 70,
            radius: 20,
            line_width: 1,
            color: 0x230ee7
        })
        this.widgets.year.data = createWidget(widget.TEXT, {
            x: (480-250)/2,
            y: 480 - 120+15,
            w: 250,
            h: 70,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            text_size: 30,
            text: 2026,
        })
        this.widgets.year.next = createWidget(widget.BUTTON, {
            x: (480 - 40) / 2 + 100,
            y: 480 - 120 + 17,
            w: 40,
            h: 60,
            radius: 12,
            color:  0x230ee7,
            text: '>',
            text_size: 30,
            click_func: () => {
                if (this.data.year <= new Date().getFullYear()+3)
                    this.data.year++
                this.widgets.year.data.setProperty(prop.TEXT, this.data.year.toString())
                this.renderDays(this.data.month, this.data.year)
            }
        })
        this.widgets.year.prev = createWidget(widget.BUTTON, {
            x: (480 - 40) / 2 - 100,
            y: 480 - 120 + 17,
            w: 40,
            h: 60,
            radius: 12,
            color:  0x230ee7,
            text: '<',
            text_size: 30,
            click_func: () => {
                if (this.data.year >= new Date().getFullYear()-3)
                    this.data.year--
                this.widgets.year.data.setProperty(prop.TEXT, this.data.year.toString())
                this.renderDays(this.data.month, this.data.year)
            }
        })               
    },
    renderDays(month, year){
        for (const i of this.widgets.days) deleteWidget(i)
        this.widgets.days = []
        const daysInMonth = (year, month) => new Date(year, month+1, 0).getDate();
        let x = 80
        let y = 120
        const now = new Date()
        console.log('Month' + month + ' now ' + now.getMonth())
        for (let i = 1; i <= daysInMonth(year, month); i++){
            let color = 0x230ee7
            if (now.getDate() == i && now.getMonth() == month && now.getFullYear() == year){
                color = styleColors.white_smoke
            }
            const day = createWidget(widget.TEXT, {
                text: i.toString(),
                text_size: 25,
                x: x,
                y: y,
                h: 30,
                w: 30,
                color: color
            })
            day.addEventListener(event.CLICK_DOWN, () => {
                push({
                    url: 'page/list',
                    params: JSON.stringify(new Date(year, month, i)),
                })
            })
            x += 50
            if ((i % 7) == 0){
                y += 50
                x = 80
            }
            this.widgets.days.push(day)
        }
    },

    /**
     * @param params Get current month events list
     */
    build(params){
        this.renderMonth()
        const now = new Date()
        this.renderDays(now.getMonth(), now.getFullYear())
        this.renderYear()
    }
})