import { setScrollMode, SCROLL_MODE_SWIPER_HORIZONTAL } from '@zos/page'
import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { createWidget, widget, align } from '@zos/ui'
import { back, push } from '@zos/router'
import { Event } from '../utils/models/Event'
import { eventServise } from '../utils/Globals'
import { styleColors } from '../utils/Constants'
import { getText } from '@zos/i18n'
import { px } from '@zos/utils'


Page ({
    widgets :{
        pageIndicator: null,
        deleteDialog: null,
    },

    registerGes(){
        onGesture({
            callback: (event) => {
            if (event === GESTURE_RIGHT) {
                back()
            }
            return true
            },
        })
    },

    renderEventPage(current_event, index){
        createWidget(widget.TEXT, {
            x: index+(480-300)/2,
            y: 200,
            w: 300,
            h: 46,
            color: styleColors.white,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            text_size: 40,
            text: current_event.description
        }),
        createWidget(widget.TEXT, {
            x: index+(480-300)/2,
            y: 270,
            w: 300,
            h: 46,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.white,
            text_size: 38,
            text: current_event.getPeriod()
        }),
         createWidget(widget.TEXT, {
            x: index,
            y: 340,
            w: 480,
            h: 46,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.white,
            text_size: 40,
            text: current_event.getDuration()
        }),
        createWidget(widget.TEXT, {
            x: index,
            y: 130,
            w: 480,
            h: 40,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.white,
            text_size: 38,
            text: current_event.getStatus()
        }),        
        createWidget(widget.ARC_PROGRESS, {
            center_x: index + 240,
            center_y: 240,
            radius: 220,
            start_angle: -150,
            end_angle: 150,
            color: styleColors.gray,
            line_width: 20,
            level: 100
        }),
        createWidget(widget.ARC_PROGRESS, {
            center_x: index + 240,
            center_y: 240,
            radius: 220,
            start_angle: -150,
            end_angle: 150,
            color: current_event.color,
            line_width: 20,
            level: current_event.getlevel()
        }),
        createWidget(widget.BUTTON, {
            x: index + (480-70)/2,
            y: 40,
            w: 70,
            h: 70,
            normal_src: 'delete.png',
            press_src: 'delete.png',
            click_func: (button_widget) => {
                this.initDeleteDialog(current_event)
            }
        })
        createWidget(widget.BUTTON, {
            x: index + (480-70)/2,
            y: 400,
            w: 70,
            h: 70,
            normal_src: 'edit.png',
            press_src: 'edit.png',
            click_func: (button_widget) => {
                push({
                    url: 'page/event/edit/menu',
                    params: JSON.stringify(current_event)
                })
            }
        })
    },

    renderAllEvents(listOfEvents){
        let x = 0
        listOfEvents.forEach(element => {
            console.log(JSON.stringify(element.description))
            this.renderEventPage(new Event(element), x)
            x += 480
        });
    },

    initDeleteDialog(current_event){
        createModal({
            content: getText('Delete this event') + '?' ,
            autoHide: true,
            show: true,
            onClick: (keyObj) => {
                const { type } = keyObj
                if (type === MODAL_CONFIRM) {
                    eventServise.deleteEvent(current_event.id)
                    push({
                        url: 'page/index'
                    })
                }
            },
        })
    },

    onInit(params){
        this.registerGes()
        let listOfEvents = null;
        try {
            listOfEvents = JSON.parse(params)
        } catch(error){
            listOfEvents = []
        }
        setScrollMode({
            mode: SCROLL_MODE_SWIPER_HORIZONTAL,
            options: {
                width: 480,
                count: listOfEvents.length
            }
        })
        if (listOfEvents.length > 1){
            this.widgets.pageIndicator = createWidget(widget.PAGE_INDICATOR, {
                x: 0,
                y: px(120),
                w: px(480),
                h: px(10),
                align_h: align.CENTER_H,
                h_space: 10,
                select_src: 'indicator/select.png',
                unselect_src: 'indicator/unselect.png'
            })
        }
        this.renderAllEvents(listOfEvents)
    }
})