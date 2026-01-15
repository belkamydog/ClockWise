import { createWidget, widget, prop } from '@zos/ui'
import { COLORS } from '../../../utils/Constants'
import { push } from '@zos/router'
import {log} from '@zos/utils'
import {PageTitle} from '../../../common/widgets/PageTitle'
import { PageIndicator } from '../../../common/widgets/pageIndicator'
import { BackBtn } from '../../../common/widgets/backBtn'

const logger = log.getLogger('colors.js')

Page({
    widgets: {
        title: null,
        backBtn: null,
        pageIndicator: null,
        viewContainer: null,
    },

    onInit(params){
        logger.log('Init color peacker page with params: ' + params)
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
                            const current_event = JSON.parse(params)
                            current_event.color = currentColor
                            logger.log('Color add to event: color: ' + JSON.stringify(current_event.color))
                            push({
                                url: 'page/event/create/repeat',
                                params: JSON.stringify(current_event)
                            })
                    }
                })
            }
        }
        this.widgets.backBtn = BackBtn.renderBackBtn('Cancel', 'page/index')
    }
})