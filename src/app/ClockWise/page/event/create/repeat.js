import { createWidget, widget, prop, align } from '@zos/ui'
import { getText } from '@zos/i18n'
import { styleColors } from '../../../utils/Constants';
import { eventServise } from '../../../utils/Globals';
import { REPEAT } from '../../../utils/Constants';
import { push } from '@zos/router'
import {log} from '@zos/utils'
import { PageIndicator } from '../../../common/widgets/pageIndicator';
import { BackBtn } from '../../../common/widgets/backBtn';
import { PageTitle } from '../../../common/widgets/PageTitle'

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
        this.widgets.title = PageTitle.renderTitle('Repeat:')
        this.widgets.pageIndicator = new PageIndicator(this.repeat.length)
        this.widgets.viewContainer = createWidget(widget.VIEW_CONTAINER, {
            x: 0,
            y: 120,
            w: 480,
            h: 270,
            scroll_enable: 1,
            pos_y: -120,
            page: 0,
            scroll_frame_func: () => {
                let y =  Math.abs(this.widgets.viewContainer.getProperty(prop.POS_Y))
                let index = y / (320 / this.repeat.length)
                this.widgets.pageIndicator.updatePageIndicator(index)
            }
        })
        const radioGroup = this.widgets.viewContainer.createWidget(widget.RADIO_GROUP, {
            x: 0,
            y: 0,
            w: 480,
            h: 480,
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
            x: x,
            y: 150,
            w: 64,
            h: 64
        })
        const everyDayRepeatBtn= radioGroup.createWidget(widget.STATE_BUTTON, {
            x: x,
            y: 250,
            w: 64,
            h: 64
        })
        const everyWeekRepeatBtn = radioGroup.createWidget(widget.STATE_BUTTON, {
            x: x,
            y: 350,
            w: 64,
            h: 64
        })
        const everyMonthRepeatBtn = radioGroup.createWidget(widget.STATE_BUTTON, {
            x: x,
            y: 450,
            w: 64,
            h: 64
        })

        const neverRepeatLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.repeat[0]),
            w: 250,
            h: 135,
            x: 70,     
            y: 140,
            align_v: align.UP,
            align_h: align.LEFT,
            text_size: 32,
            color: styleColors.white_smoke
        })
        const everyDayRepeatLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.repeat[1]),
            w: 250,
            h: 64,
            x: 70,
            y: 240,
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: 32,
            color: styleColors.white_smoke
        })
        const everyWeekRepeatLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.repeat[2]),
            w: 250,
            h: 64,
            x: 70,
            y: 340,
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: 32,
            color: styleColors.white_smoke
        })
        const everyMonthRepeatLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.repeat[3]),
            w: 250,
            h: 64,
            x: 70,
            y: 440,
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: 32,
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

    }
})