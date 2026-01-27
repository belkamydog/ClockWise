import { setScrollMode, SCROLL_MODE_SWIPER_HORIZONTAL } from '@zos/page'
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { createWidget, widget, align } from '@zos/ui'
import { back, push } from '@zos/router'
import { getText } from '@zos/i18n'
import { px } from '@zos/utils'
import { Event } from '../utils/models/Event'
import { SCREEN_SIZE, styleColors } from '../utils/Constants'
import { DeleteDialog } from '../common/widgets/DeleteDialog'

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

    getRepeatField(event){
        let result = ''
        switch (event.check_repeat) {
              case 'never':
                  result = '🔄 ' + getText('Once');;
                  break;
              case 'day':
                  result = '🔄 ' + getText('Every day');
                  break;
              case 'week':
                  result = '🔄 ' + getText('Every week');
                  break;
              case 'month':
                  result = '🔄 ' + getText('Every month');
                  break;
          }
          return result
    },

    renderEventPage(current_event, index){
        createWidget(widget.TEXT, {
            x: px(index+(SCREEN_SIZE-300)/2),
            y: px(200),
            w: px(300),
            h: px(46),
            color: styleColors.white,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            text_size: px(40),
            text: current_event.description
        }),
        createWidget(widget.TEXT, {
            x: px(index+(SCREEN_SIZE-300)/2),
            y: px(270),
            w: px(300),
            h: px(46),
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.white,
            text_size: px(35),
            text: current_event.getPeriod()
        }),
        createWidget(widget.TEXT, {
            x: px(index),
            y: px(340),
            w: px(480),
            h: px(46),
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.white,
            text_size: px(35),
            text: current_event.getDuration()
        }),
        createWidget(widget.TEXT, {
            x: px(index),
            y: px(80),
            w: px(480),
            h: px(40),
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.white,
            text_size: px(35),
            text: this.getRepeatField(current_event)
        }),         
        createWidget(widget.TEXT, {
            x: px(index),
            y: px(140),
            w: px(480),
            h: px(40),
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.white,
            text_size: px(35),
            text: current_event.getStatus()
        }),        
        createWidget(widget.ARC_PROGRESS, {
            center_x: px(index + SCREEN_SIZE/2),
            center_y: px(SCREEN_SIZE/2),
            radius: px(SCREEN_SIZE/2-10),
            start_angle: -150,
            end_angle: 150,
            color: styleColors.gray,
            line_width: px(20),
            level: 100
        }),
        createWidget(widget.ARC_PROGRESS, {
            center_x: px(index + SCREEN_SIZE/2),
            center_y: px(SCREEN_SIZE/2),
            radius: px(SCREEN_SIZE/2-10),
            start_angle: -150,
            end_angle: 150,
            color: current_event.color,
            line_width: px(20),
            level: current_event.getlevel()
        }),
        createWidget(widget.BUTTON, {
            x: px(index + (SCREEN_SIZE-70)/2 -150) ,
            y: px(270-10),
            w: px(70),
            h: px(70),
            normal_src: 'delete.png',
            press_src: 'delete.png',
            click_func: (button_widget) => {
                new DeleteDialog(current_event, new Date(), 'page/index')
            }
        })
        createWidget(widget.BUTTON, {
            x: px(index + (SCREEN_SIZE-70)/2+ 150),
            y: px(272-10),
            w: px(70),
            h: px(70),
            normal_src: 'edit.png',
            press_src: 'edit.png',
            click_func: (button_widget) => {
                push({
                    url: 'page/event/edit/menu',
                    params: JSON.stringify(current_event)
                })
            }
        })
        createWidget(widget.BUTTON, {
            x: px(index + (SCREEN_SIZE-70)/2),
            y: px(400),
            w: px(70),
            h: px(70),
            normal_src: 'back.png',
            press_src: 'back.png',
            click_func: (button_widget) => {
                push({
                    url: 'page/index',
                })
            }
        })
    },

    renderAllEvents(listOfEvents){
        let x = 0
        listOfEvents.forEach(element => {
            console.log(JSON.stringify(element.description))
            this.renderEventPage(new Event(element), x)
            x += SCREEN_SIZE
        });
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
                width: px(SCREEN_SIZE),
                count: listOfEvents.length
            }
        })
        if (listOfEvents.length > 1){
            this.widgets.pageIndicator = createWidget(widget.PAGE_INDICATOR, {
                x: px(0),
                y: px(50),
                w: px(SCREEN_SIZE),
                h: px(10),
                align_h: align.CENTER_H,
                h_space: px(10),
                select_src: 'indicator/select.png',
                unselect_src: 'indicator/unselect.png'
            })
        }
        this.renderAllEvents(listOfEvents)
    }
})