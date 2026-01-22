import { createWidget, widget, prop } from '@zos/ui'
import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { push } from '@zos/router'
import {log} from '@zos/utils'
import { getText } from '@zos/i18n'
import { styleColors } from '../utils/Constants'
import { BackBtn } from '../common/widgets/backBtn'
import { PageIndicator } from '../common/widgets/PageIndicator'
import {PageTitle} from '../common/widgets/PageTitle'

const logger = log.getLogger('Main menu')

Page({
    widgets: {
        cyckleList: null,
        pageTitle: null,
        pageIngicator: null,
        viewContainer: null,
        backBtn: null,
    },

    initNewEventDialog(){
        const dialog = createModal({
            content: getText('Create event') + '?',
            autoHide: false,
            show: false,
            onClick: (keyObj) => {
                const { type } = keyObj
                if (type === MODAL_CONFIRM) {
                    logger.log('Create new event init')
                    push({
                        url: 'page/event/create/description',
                    })
                    dialog.show(false)
                } else {
                    logger.log('Create new event canceled')
                    dialog.show(false)
                }
            },
        })
        dialog.show(true) 
    },

    onInit(){
        const menu = [
            {src:'', text: getText('New event')},
            {src:'', text: getText('Calendar')},
            {src:'', text: getText('Settings')},
            {src:'', text: getText('About')},
        ]
        this.widgets.pageTitle = PageTitle.renderTitle('Main menu')
        this.widgets.pageIngicator = new PageIndicator(menu.length)
        this.widgets.cycleList = createWidget(widget.CYCLE_IMAGE_TEXT_LIST, {
            x: (480-330)/2,
            y: (480-300)/2+20,
            w: 330,
            h: 270,
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
                    this.initNewEventDialog()
                } else if (index == 1){
                    logger.log('Push to the list of events page')
                    push({
                        url: 'page/calendar',
                    })
                } else if (index == 2) {
                    logger.log('Push to the settings page')
                    push({
                        url: 'page/settings/menu',
                    })
                } else if (index == 3) {
                    logger.log('Push to the about page')
                    push({
                        url: 'page/about',
                    })
                }

            },
            item_focus_change_func: (cycleList, index, isFocus) =>{
                this.widgets.pageIngicator.updatePageIndicator(index)
            }
        })
        this.widgets.backBtn = BackBtn.renderBackBtn('Main page', 'page/index')
    }
})