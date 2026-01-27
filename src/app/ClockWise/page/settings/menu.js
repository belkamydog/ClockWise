import { createModal, MODAL_CONFIRM, onGesture, GESTURE_RIGHT} from '@zos/interaction'
import { createWidget, widget, align, prop} from '@zos/ui'
import { getText } from '@zos/i18n'
import { push } from '@zos/router'
import { px } from '@zos/utils'
import { PageIndicator } from '../../common/widgets/PageIndicator'
import { PageTitle } from '../../common/widgets/PageTitle'
import { BackBtn } from '../../common/widgets/backBtn'
import { styleColors } from '../../utils/Constants'
import { eventServise } from '../../utils/Globals'


Page({
    widgets:{
        title: null,
        backBtn: null,
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


    initClearHistoryDialog(){
        const dialog = createModal({
            content: getText('Attention! This will delete all events') + '!',
            autoHide: false,
            show: false,
            onClick: (keyObj) => {
                const { type } = keyObj
                if (type === MODAL_CONFIRM) {
                    push({
                        url: 'page/index',
                    })
                    eventServise.clearHistoryOfEvents()
                    dialog.show(false)
                } else {
                    dialog.show(false)
                }
            },
        })
        dialog.show(true) 
    },

    onInit(){
        this.registerGes()
        this.widgets.title = PageTitle.renderTitle('Settings')
        const menu = [
            {src:'', text: '📅 ' + getText('Auto delete')},
            {src:'', text: '🗑️ ' + getText('Clear history')},
        ]
        const pageIndicator = new PageIndicator(menu.length)
        cycleList = createWidget(widget.CYCLE_IMAGE_TEXT_LIST, {
            x: px((480-330)/2),
            y: px(120),
            w: px(330),
            h: px(300),
            data_array: menu,
            item_text_align_h: align.LEFT,
            data_size: menu.length,
            item_height: px(120),
            item_bg_color: styleColors.black,
            item_text_color: styleColors.white_smoke,
            item_text_x: px(10),
            item_text_y: px(10),
            item_text_size: px(40),
            item_click_func: (cyckleList ,index) => {
                if (index == 0){
                    push({
                        url: 'page/settings/history',
                    })
                } else if (index == 1){
                    this.initClearHistoryDialog()
                }
            },
            item_focus_change_func: (cycleList, index, isFocus) => {
                pageIndicator.updatePageIndicator(index)
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
            },
        })
        this.widgets.backBtn = BackBtn.renderBackBtn('Main page', 'page/index')
    }
})