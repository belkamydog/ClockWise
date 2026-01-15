import { getText } from '@zos/i18n'
import { widget, createWidget, deleteWidget, align, event, prop} from '@zos/ui'
import { MONTH, styleColors } from '../utils/Constants'
import { push } from '@zos/router'
import { px } from "@zos/utils"
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { eventServise } from '../utils/Globals'

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
        pageIngicator: null,
        days: [],
        mainPageBtn: null,
        backBtn: null,

    },
    data:{
        scrollIndex: -30,
        month: 0,
        year: new Date().getFullYear()
    },


    registerGes(){
        onGesture({
            callback: (event) => {
            if (event === GESTURE_RIGHT) {
                push({
                url: 'page/index',
                })
            }
            return true
            },
        })
    },    
    renderMonth(){
        this.widgets.month.border = createWidget(widget.STROKE_RECT, {
            x: (480-250)/2,
            y: 35,
            w: 250,
            h: 70,
            radius: 20,
            line_width: 1,
            color: styleColors.white_smoke
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
            color: styleColors.white_smoke
        })
        this.widgets.month.prev = createWidget(widget.BUTTON, {
            x: (480 - 40) / 2 - 100,
            y: 38,
            w: 40,
            h: 60,
            radius: 12,
            color: styleColors.white_smoke,
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
            color: styleColors.white_smoke,
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
            color: styleColors.white_smoke
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
            color: styleColors.white_smoke
        })
        this.widgets.year.next = createWidget(widget.BUTTON, {
            x: (480 - 40) / 2 + 100,
            y: 480 - 120 + 17,
            w: 40,
            h: 60,
            radius: 12,
            color: styleColors.white_smoke,
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
            color: styleColors.white_smoke,
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
    renderDays(month, year) {
        for (const i of this.widgets.days) deleteWidget(i)
        this.widgets.days = [];
        const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
        console.log(daysInMonth(year, month))
        let x = 80;
        let y = 120;
        const now = new Date();
        // const workLoad = eventServise.getMonthWorkLoad(new Date(year, month, 1));
        const currentDate = {
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate()
        };
        const currentDayBg = createWidget(widget, FILL_RECT, {
            x: x,
            y: y,
            w: 400,
            h: 400,
            radius: 20,
            line_width: 4,
            color: styleColors.green
        });
        for (let i = 1; i <= daysInMonth(year, month); i++) {
            let color = styleColors.white_smoke;
            const dayDate = new Date(year, month, i);
            const isCurrentDay = 
                dayDate.getFullYear() === currentDate.year &&
                dayDate.getMonth() === currentDate.month &&
                dayDate.getDate() === currentDate.day;

            if (isCurrentDay) {
                console.log('isCurrent Day')
                const currentDayBg = createWidget(widget.STROKE_RECT, {
                    x: x-6,
                    y: y-6,
                    w: 45,
                    h: 45,
                    radius: 5,
                    line_width: 2,
                    color: styleColors.white_smoke
                })
                this.widgets.days.push(currentDayBg);
            }
            // color = workLoad[i - 1] > 0 ? styleColors.green : styleColors.dim_gray;
            const day = createWidget(widget.TEXT, {
                text: i.toString(),
                text_size: 25,
                x,
                y,
                h: 30,
                w: 30,
                color
            });
            day.addEventListener(event.CLICK_DOWN, () => {
                const date = new Date(year, month, i);
                push({
                    url: 'page/list',
                    params: date
                });
            });
            x += 50;
            if (i % 7 === 0) {
                y += 50;
                x = 80;
            }
            this.widgets.days.push(day);
        }
    },

    /**
     * @param params Get current month events list
     */
    build(params){
        this.registerGes()
        this.renderMonth()
        const now = new Date()
        this.renderDays(now.getMonth(), now.getFullYear())
        this.renderYear()
    }
})