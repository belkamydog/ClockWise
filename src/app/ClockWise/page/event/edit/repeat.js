import { createWidget, widget, prop, align } from '@zos/ui'
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { getText } from '@zos/i18n'
import { push } from '@zos/router'
import { log, px } from '@zos/utils'
import { PageIndicator } from '../../../common/widgets/PageIndicator';
import { PageTitle } from '../../../common/widgets/PageTitle'
import { BackBtn } from '../../../common/widgets/backBtn';
import { SCREEN_SIZE, styleColors } from '../../../utils/Constants';
import { eventServise } from '../../../utils/Globals';
import { REPEAT } from '../../../utils/Constants';

let repeat_page_index = 0
const logger = log.getLogger('page/event/edit/repeat.js')

Page({
    repeat: ['Never','Every day', 'Every week', 'Every month'],
    widgets: {
        viewContainer: null,
        title: null,
        backBtn: null,
        pageIndicator: null,
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

    onInit(params){
        this.registerGes()
        logger.log('Init edit repeat page with params: ' + params)
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
            y: px(240),
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
        const repeatIndex = REPEAT.indexOf(JSON.parse(params).check_repeat)
        if (repeatIndex == 1) radioGroup.setProperty(prop.INIT, everyDayRepeatBtn)
        else if (repeatIndex == 2) radioGroup.setProperty(prop.INIT, everyWeekRepeatBtn)
        else if (repeatIndex == 3) radioGroup.setProperty(prop.INIT, everyMonthRepeatBtn)
        else radioGroup.setProperty(prop.INIT, neverRepeatBtn)
        this.widgets.backBtn = BackBtn.renderBackBtn('Apply')
        const click_func = () => {
            let result = JSON.parse(params)
            result.repeat = REPEAT[repeat_page_index]
            result.check_repeat = REPEAT[repeat_page_index]
            logger.log('Edit repeate done new repeat: ' + result.repeat)
            eventServise.editEvent(result)
            push({
                url: 'page/index',
            })
        }
        this.widgets.backBtn.click_func = click_func
    }
})