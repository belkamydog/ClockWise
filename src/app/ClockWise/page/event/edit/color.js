import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { createWidget, widget, prop } from '@zos/ui'
import { push } from '@zos/router'
import {log} from '@zos/utils'
import { eventServise } from '../../../utils/Globals';
import { COLORS } from '../../../utils/Constants'
import {PageTitle} from '../../../common/widgets/PageTitle'
import { PageIndicator } from '../../../common/widgets/pageIndicator'
import { BackBtn } from '../../../common/widgets/backBtn'

const logger = log.getLogger('page/event/edit/color.js')

Page({
    widgets: {
        title: null,
        backBtn: null,
        pageIndicator: null,
        viewContainer: null,
    },

    registerGes(){
        onGesture({
            callback: (event) => {
            if (event === GESTURE_RIGHT) {
                logger.log('Edit color canceled push to edit menu')
                push({
                    url: 'page/event/edit/menu',
                    params: JSON.stringify(event)
                })
            }
            return true
            },
        })
    },

    onInit(params){
        logger.log('Init edit color page, current color is: ' + JSON.parse(params).color)
        this.registerGes()
        this.widgets.title = PageTitle.renderTitle('Event color')
        this.widgets.pageIndicator = new PageIndicator(COLORS.length/4)
        this.widgets.viewContainer = createWidget(widget.VIEW_CONTAINER, {
            x: 0,
            y: 150,
            w: 480,
            h: 220,
            scroll_enable: 1,
            pos_y: -80,
            page: 0,
            scroll_frame_func: () => {
                let y =  Math.abs(this.widgets.viewContainer.getProperty(prop.POS_Y))
                let index = y / (400 / (COLORS.length/4))
                this.widgets.pageIndicator.updatePageIndicator(index)
            }
        })
        for (let row = 0, color_i = 0; row < COLORS.length/4; row++){
            for (let col = 0; col < 3; col++){
                const currentColor = COLORS[color_i++]
                const btn = this.widgets.viewContainer.createWidget(widget.BUTTON, {
                    x: 80 + 100 * col + 20,
                    y: 80 + 100 * row,
                    w: 80,
                    h: 80,
                    radius: 0,
                    normal_color: currentColor,
                    press_color: 0xfeb4a8,
                    text: '',
                    click_func: (color_i) => {
                        let current_event = JSON.parse(params)
                        current_event.color = currentColor
                        eventServise.editEvent(current_event)
                        logger.log('Edit color done, current color: ' + current_event.color)
                        push({
                            url: 'page/index',
                        })
                    }
                })
            }
        }
        this.widgets.backBtn = BackBtn.renderBackBtn('Cancel', 'page/index')
    }
})