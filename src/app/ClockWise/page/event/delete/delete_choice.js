import { createWidget, widget, prop, align } from '@zos/ui'
import { getText } from '@zos/i18n'
import { push } from '@zos/router'
import {log, px} from '@zos/utils'
import { PageIndicator } from '../../../common/widgets/PageIndicator';
import { BackBtn } from '../../../common/widgets/backBtn';
import { SCREEN_SIZE, styleColors } from '../../../utils/Constants';
import { eventServise } from '../../../utils/Globals';

const logger = log.getLogger('delete_choice.js')

Page({
    choice: ['All repeats', 'Current event'],
    widgets: {
        deleteBtn: null,
        backBtn: null,
        viewContainer: null,
        pageIndicator: null,
        radio: null,
    },
    data: {
        btnIndex: 0,
    }, 

    initViewContainer(){
        this.widgets.viewContainer = createWidget(widget.VIEW_CONTAINER, {
            x: px(0),
            y: px(120),
            w: px(480),
            h: px(270),
            scroll_enable: 1,
            pos_y: px(-120),
            page: px(0),
            scroll_frame_func: () => {
                let y =  Math.abs(this.widgets.viewContainer.getProperty(prop.POS_Y))
                let index = y / px(250 / 3)
                this.widgets.pageIndicator.updatePageIndicator(index)
            }
        })
    },

    createRadioGroup(){
        this.widgets.radio = this.widgets.viewContainer.createWidget(widget.RADIO_GROUP, {
            x: px(0),
            y: px(0),
            w: px(SCREEN_SIZE),
            h: px(SCREEN_SIZE),
            select_src: 'radio_selected.png',
            unselect_src: 'radio_unselected.png',
            check_func: (group, index, checked) => {
                if (checked){
                    this.data.btnIndex = index
                } 
            }
        })
        this.widgets.radio.createWidget(widget.STATE_BUTTON, {
            x: px(380),
            y: px(160),
            w: px(64),
            h: px(64)
        })
        this.widgets.radio.createWidget(widget.STATE_BUTTON, {
            x: px(380),
            y: px(260),
            w: px(64),
            h: px(100)
        })
        this.widgets.radio.setProperty(prop.INIT, 0)
        this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText('Current event'),
            w: px(270),
            h: px(300),
            x: px(70),     
            y: px(150),
            align_v: align.UP,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })
        this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText('All repeats'),
            w: px(270),
            h: px(64),
            x: px(70),
            y: px(250),
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })
    },

    onInit(params){
        this.widgets.pageIndicator = new PageIndicator(3)
        this.initViewContainer()
        this.createRadioGroup()
        const { id, date, goBackUrl} = JSON.parse(params)
        this.data.btnIndex = 0
        this.widgets.deleteBtn = createWidget(widget.BUTTON, {
            x: 40,
            y: 0,
            w: 400,
            h: 80,
            radius: 0,
            normal_color: styleColors.dark_red,
            press_color: styleColors.dark_gray,
            text: getText('Delete'),
            text_size: 32,
            click_func: () => {
                if (this.data.btnIndex == 1){
                    eventServise.deleteEvent(id)
                    push ({
                        url: goBackUrl
                    })
                } else {
                    eventServise.deleteRepeatOfEvent(id, date)
                    push ({
                        url: goBackUrl
                    })
                }
                }
        })
        this.widgets.backBtn = BackBtn.renderBackBtn('Cancel', 'page/index')

    }
})