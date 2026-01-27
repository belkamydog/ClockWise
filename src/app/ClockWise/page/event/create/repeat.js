import { createWidget, widget, prop, align } from '@zos/ui'
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { getText } from '@zos/i18n'
import { push } from '@zos/router'
import {log, px} from '@zos/utils'
import { styleColors, REPEAT, SCREEN_SIZE } from '../../../utils/Constants';
import { PageIndicator } from '../../../common/widgets/PageIndicator';
import { PageTitle } from '../../../common/widgets/PageTitle'
import { BackBtn } from '../../../common/widgets/backBtn';
import { eventServise } from '../../../utils/Globals';


const logger = log.getLogger('colors.js')
let repeat_page_index = 0


Page({
    repeat: ['Never','Every day', 'Every week', 'Every month'],
    widgets: {
        viewContainer: null,
        title: null,
        backBtn: null,
        pageIndicator: null,
    },

    onInit(params){
        logger.log('Init repeat choose page with params: ' + params)
        this.registerGes()
        this.widgets.title = PageTitle.renderTitle('Repeat:')
        this.widgets.pageIndicator = new PageIndicator(this.repeat.length)
        this.widgets.viewContainer = createWidget(widget.VIEW_CONTAINER, {
            x: px(0),
            y: px(120),
            w: px(SCREEN_SIZE),
            h: px(270),
            scroll_enable: 1,
            pos_y: px(-120),
            page: 0,
            scroll_frame_func: () => {
                let y =  Math.abs(this.widgets.viewContainer.getProperty(prop.POS_Y))
                let index = y / (px(320) / this.repeat.length)
                this.widgets.pageIndicator.updatePageIndicator(index)
            }
        })
        const radioGroup = this.widgets.viewContainer.createWidget(widget.RADIO_GROUP, {
            x: px(0),
            y: px(0),
            w: px(SCREEN_SIZE),
            h: px(SCREEN_SIZE),
            select_src: 'radio_selected.png',
            unselect_src: 'radio_unselected.png',
            check_func: (group, index, checked) => {
                if (checked){
                    repeat_page_index = index
                } 
            }
        })
        const x = 380
        const neverRepeatBtn = radioGroup.createWidget(widget.STATE_BUTTON, {
            x: px(x),
            y: px(150),
            w: px(64),
            h: px(64)
        })
        const everyDayRepeatBtn= radioGroup.createWidget(widget.STATE_BUTTON, {
            x: px(x),
            y: px(250),
            w: px(64),
            h: px(64)
        })
        const everyWeekRepeatBtn = radioGroup.createWidget(widget.STATE_BUTTON, {
            x: px(x),
            y: px(350),
            w: px(64),
            h: px(64)
        })
        const everyMonthRepeatBtn = radioGroup.createWidget(widget.STATE_BUTTON, {
            x: px(x),
            y: px(450),
            w: px(64),
            h: px(64)
        })

        const neverRepeatLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.repeat[0]),
            w: px(250),
            h: px(135),
            x: px(70),     
            y: px(140),
            align_v: align.UP,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })
        const everyDayRepeatLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.repeat[1]),
            w: px(250),
            h: px(64),
            x: px(70),
            y: px(SCREEN_SIZE/2),
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })
        const everyWeekRepeatLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.repeat[2]),
            w: px(250),
            h: px(64),
            x: px(70),
            y: px(340),
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })
        const everyMonthRepeatLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.repeat[3]),
            w: px(250),
            h: px(64),
            x: px(70),
            y: px(440),
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })

        radioGroup.setProperty(prop.INIT, neverRepeatBtn)

        this.widgets.backBtn = BackBtn.renderBackBtn('Create')
        const click_func =  () => {
            let result = JSON.parse(params)
            result.repeat = REPEAT[repeat_page_index]
            result.check_repeat = REPEAT[repeat_page_index]
            logger.log('Repeat add to event: ' + result.repeat)
            eventServise.createNewEvent(result)
            console.log('print')
            push({
                url: 'page/index',
                params: 'clear'
        })
        }
        this.widgets.backBtn.click_func = click_func

    },

    registerGes(){
        onGesture({
            callback: (event) => {
            if (event === GESTURE_RIGHT) {
            }
            return true
            },
        })
    },
})