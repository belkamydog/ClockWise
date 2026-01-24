import { createWidget, widget, prop, align } from '@zos/ui'
import { getText } from '@zos/i18n'
import { styleColors } from '../../../utils/Constants';
import { eventServise } from '../../../utils/Globals';
import { push } from '@zos/router'
import {log} from '@zos/utils'
import { BackBtn } from '../../../common/widgets/backBtn';
import { PageTitle } from '../../../common/widgets/PageTitle'
import { PageIndicator } from '../../../common/widgets/PageIndicator';

const logger = log.getLogger('delete_choice.js')

Page({
    choice: ['All repeats', 'Current event'],
    widgets: {
        title: null,
        backBtn: null,
        viewContainer: null,
        pageIndicator: null,
        radio: null
    },
    data: {
        btnIndex: 0,
    }, 

    initViewContainer(){
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
                let index = y / (250 / 3)
                this.widgets.pageIndicator.updatePageIndicator(index)
            }
        })
    },

    createRadioGroup(){
        this.widgets.radio = this.widgets.viewContainer.createWidget(widget.RADIO_GROUP, {
            x: 0,
            y: 0,
            w: 480,
            h: 480,
            select_src: 'radio_selected.png',
            unselect_src: 'radio_unselected.png',
            check_func: (group, index, checked) => {
                if (checked){
                    this.data.btnIndex = index
                } 
            }
        })
        this.widgets.radio.createWidget(widget.STATE_BUTTON, {
            x: 350,
            y: 160,
            w: 64,
            h: 64
        })
        this.widgets.radio.createWidget(widget.STATE_BUTTON, {
            x: 350,
            y: 260,
            w: 64,
            h: 100
        })
        this.widgets.radio.setProperty(prop.INIT, 0)
        this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText('Current event'),
            w: 200,
            h: 300,
            x: 100,     
            y: 150,
            align_v: align.UP,
            align_h: align.LEFT,
            text_size: 32,
            color: styleColors.white_smoke
        })
        this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText('All repeats'),
            w: 200,
            h: 64,
            x: 100,
            y: 250,
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: 32,
            color: styleColors.white_smoke
        })
    },

    onInit(params){
        this.widgets.title = PageTitle.renderTitle('Delete')
        this.widgets.pageIndicator = new PageIndicator(3)
        this.initViewContainer()
        this.createRadioGroup()
        const { id, date, goBackUrl} = JSON.parse(params)
        this.data.btnIndex = 0
        this.widgets.viewContainer.createWidget(widget.BUTTON, {
            x: (480-250)/2,
            y: 360,
            w: 250,
            h: 80,
            radius: 40,
            normal_color: styleColors.dodger_blue,
            press_color: styleColors.blue_violet,
            text: getText('Confirm'),
            text_size: 30,
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