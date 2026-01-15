import { getText } from '@zos/i18n'
import { widget, createWidget, deleteWidget, align, event, prop} from '@zos/ui'
import { MONTH_SHORT, styleColors, WEEK_DAYS_SHORT, WEEK_DAYS_SHORT_2 } from '../utils/Constants'
import { push } from '@zos/router'
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { eventServise } from '../utils/Globals'
import { PageIndicator } from '../common/widgets/PageIndicator'
import { BackBtn } from '../common/widgets/backBtn'

Page({
    widgets: {
        month:{
            border: null,
            data: null,
            prev: null,
            next: null,
        },
        weekDays: [],
        pageIngicator: null,
        viewContainer: null,
        days: [],
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

    getMonthTitle(){
        return getText(MONTH_SHORT[this.data.month]) + ' ' + this.data.year
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
            text: this.getMonthTitle(),
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
                }
                this.data.month = (--this.data.month % 12 + 12) % 12
                this.widgets.month.data.setProperty(prop.TEXT, this.getMonthTitle())
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
                }
                this.data.month += 1
                this.data.month = (this.data.month % 12 + 12) % 12
                this.widgets.month.data.setProperty(prop.TEXT, this.getMonthTitle())
                this.renderDays(this.data.month, this.data.year)
            }
        })        
    },

    renderWeekDays(){
        let x = 70
        WEEK_DAYS_SHORT_2.forEach(element => {
            const wd = createWidget(widget.TEXT, {
                text: getText(element),
                text_size: 25,
                x: x,
                y: 110,
                h: 30,
                w: 35,
                color: styleColors.dark_gray
            })
            x += 52
            this.widgets.weekDays.push(wd)
        });

    },

    renderDays(month, year) {
        for (const i of this.widgets.days) deleteWidget(i)
        this.widgets.days = [];
        const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
        const startWeekDay = new Date(year, month, 1).getDay()
        let x = startWeekDay == 0 ? 380 : startWeekDay * 52 + 20;
        let y = 150;
        const now = new Date();
        const workLoad = eventServise.getMonthWorkLoad(new Date(year, month, 1));
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
            const weekDay = dayDate.getDay()
            const isCurrentDay = 
                dayDate.getFullYear() === currentDate.year &&
                dayDate.getMonth() === currentDate.month &&
                dayDate.getDate() === currentDate.day;

            if (isCurrentDay) {
                console.log('isCurrent Day')
                const currentDayBg = this.widgets.viewContainer.createWidget(widget.STROKE_RECT, {
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
            color = workLoad[i - 1] > 0 ? styleColors.white_smoke : styleColors.dim_gray;
            const day = this.widgets.viewContainer.createWidget(widget.TEXT, {
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
            x += 52;
            if (weekDay === 0) {
                y += 80;
                x = 70;
            }
            this.widgets.days.push(day);
        }
    },

    /**
     * @param params Get current month events list
     */
    build(params){
        this.widgets.viewContainer = createWidget(widget.VIEW_CONTAINER, {
            x: 0,
            y: 150,
            w: 480,
            h: 220,
            scroll_enable: 1,
            pos_y: -145,
            page: 0,
            scroll_frame_func: () => {
                let y =  Math.abs(this.widgets.viewContainer.getProperty(prop.POS_Y))
                console.log('pos y ' + y)
                let index = y / (520 / 2)
                this.widgets.pageIndicator.updatePageIndicator(index)
            }
        });
        this.widgets.pageIndicator = new PageIndicator(2)
        this.registerGes()
        this.renderMonth()
        this.renderWeekDays()
        const now = new Date()
        this.renderDays(now.getMonth(), now.getFullYear())
        this.widgets.backBtn = BackBtn.renderBackBtn('Main page', 'page/index')
    }
})