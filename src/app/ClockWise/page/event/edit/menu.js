import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { createWidget, widget, align, prop} from '@zos/ui'
import { getText } from '@zos/i18n'
import { push } from '@zos/router'
import { log, px } from '@zos/utils'
import { PageIndicator } from '../../../common/widgets/PageIndicator'
import { PageTitle } from '../../../common/widgets/PageTitle'
import { BackBtn } from '../../../common/widgets/backBtn'
import { SCREEN_SIZE, styleColors } from '../../../utils/Constants'

const logger = log.getLogger('page/event/edit/menu.js')

Page({
    widgets: {
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

    initNewEventDialog(){
        const dialog = createModal({
            content: getText('Edit event') + '?',
            autoHide: false,
            show: false,
            onClick: (keyObj) => {
                const { type } = keyObj
                if (type === MODAL_CONFIRM) {
                push({
                    url: 'page/event/description',
                })
                    dialog.show(false)
                } else {
                    dialog.show(false)
                }
            },
        })
        dialog.show(true) 
    },
    onInit(params){
        logger.log('Init edit event menu page with params: ' + params)
        this.registerGes()
        const menu = [
            {src:'', text: '📝 ' + getText('Description')},
            {src:'', text: '🚀 '+ getText('Start date')},
            {src:'', text: '🏁 ' + getText('End date')},
            {src:'', text: '🎨 ' + getText('Color')},
            {src:'', text:  '🪃 ' + getText('Repeat')},
        ]
        this.widgets.title = PageTitle.renderTitle('Edit')
        this.widgets.pageIndicator = new PageIndicator(menu.length)
        cycleList = createWidget(widget.CYCLE_IMAGE_TEXT_LIST, {
            x: px((SCREEN_SIZE-330)/2),
            y: px((SCREEN_SIZE-300)/2+20),
            w: px(330),
            h: px(300-20),
            data_array: menu,
            data_size: menu.length,
            item_height: px(120),
            item_text_align_h: align.LEFT,
            item_bg_color: styleColors.black,
            item_text_color: styleColors.white_smoke,
            item_text_x: px(10),
            item_text_y: px(10),
            item_text_size: px(40),
            item_click_func: (cyckleList ,index) => {
                if (index == 0){
                    logger.log('Init edit description')
                    push({
                        url: 'page/event/edit/description',
                        params: params
                    })
                } else if (index == 1){
                    logger.log('Init edit start of event')
                    push({
                        url: 'page/event/edit/start_date',
                        params: params
                    })
                } else if (index == 2) {
                    logger.log('Init edit end of event')
                    push({
                        url: 'page/event/edit/end_date',
                        params: params
                    })
                } else if (index == 3) {
                    logger.log('Init edit color')
                    push({
                        url: 'page/event/edit/color',
                        params: params
                    })
                } else if (index == 4) {
                    logger.log('Init edit repeat')
                    push({
                        url: 'page/event/edit/repeat',
                        params: params
                    })  
                }
            },
            item_focus_change_func: (cycleList, index, isFocus) => {
                this.widgets.pageIndicator.updatePageIndicator(index)
                if (isFocus) {
                    cycleList.setProperty(prop.ITEM_MORE, {
                        index: index,
                        item_text_size: px(45)
                    });
                } else {
                    cycleList.setProperty(prop.ITEM_MORE, {
                        index: index,
                        item_text_size: px(40)
                    });
                }
            }
        })
        this.widgets.backBtn = BackBtn.renderBackBtn('Main page', 'page/index')
    }
})