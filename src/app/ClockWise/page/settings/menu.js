import { createWidget, widget } from '@zos/ui'
import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { push } from '@zos/router'
import { getText } from '@zos/i18n'
import { styleColors } from '../../utils/Constants'
import { eventServise } from '../../utils/Globals'
import { PageIndicator } from '../../common/widgets/PageIndicator'
import { BackBtn } from '../../common/widgets/backBtn'
import { PageTitle } from '../../common/widgets/PageTitle'

Page({
    widgets:{
        title: null,
        backBtn: null,
    },

    initClearHistoryDialog(){
        const dialog = createModal({
            content: getText('Clear history') + '?',
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

    build(){
        this.widgets.title = PageTitle.renderTitle('Settings')
        const menu = [
            {src:'', text: getText('Auto delete')},
            {src:'', text: getText('Clear history')},
        ]
        const pageIndicator = new PageIndicator(menu.length)
        cycleList = createWidget(widget.CYCLE_IMAGE_TEXT_LIST, {
            x: (480-330)/2,
            y: 120,
            w: 330,
            h: 300,
            data_array: menu,
            data_size: menu.length,
            item_height: 120,
            item_bg_color: styleColors.black,
            item_text_color: styleColors.white_smoke,
            item_text_x: 10,
            item_text_y: 10,
            item_text_size: 40,
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
            },
        })
        this.widgets.backBtn = BackBtn.renderBackBtn('Main page', 'page/index')
    }
})