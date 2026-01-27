import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { createWidget, widget, prop } from '@zos/ui'
import { getText } from '@zos/i18n'
import { push } from '@zos/router'
import { px } from '@zos/utils'
import { SCREEN_SIZE, styleColors } from '../utils/Constants'
import { PageIndicator } from '../common/widgets/PageIndicator'
import {PageTitle} from '../common/widgets/PageTitle'

export class MainMenu {

    #initNewEventDialog(){
        const dialog = createModal({
            content: getText('Create event') + '?',
            autoHide: false,
            show: false,
            onClick: (keyObj) => {
                const { type } = keyObj
                if (type === MODAL_CONFIRM) {
                    push({
                        url: 'page/event/create/description',
                    })
                    dialog.show(false)
                } else {
                    dialog.show(false)
                }
            },
        })
        dialog.show(true) 
    }

    constructor(){
        const SHIFT = px(SCREEN_SIZE+20)
        const menu = [
            {src:'', text: '✏️ ' + getText('Create')},
            {src:'', text: '🕒 ' + getText('Today')},
            {src:'', text: '📅 ' + getText('Calendar')},
            {src:'', text: '⚙️ ' + getText('Settings')},
            {src:'', text: '❔ ' + getText('About')},
        ]
        const title = PageTitle.renderTitle('Main menu')
        title.x += SHIFT
        const pageIngicator = new PageIndicator(menu.length)
        pageIngicator.background.x += SHIFT
        pageIngicator.indicator.x += SHIFT

        const cycleList = createWidget(widget.CYCLE_IMAGE_TEXT_LIST, {
            x: px((SCREEN_SIZE-330)/2) + SHIFT,
            y: px((SCREEN_SIZE-300)/2) + 20,
            w: px(350),
            h: px(370),
            data_array: menu,
            data_size: menu.length,
            item_height: px(120),
            item_text_align_h: 1,
            item_bg_color: styleColors.black,
            item_text_color: styleColors.white_smoke,
            
            item_text_x: px(10),
            item_text_y: px(10),
            item_text_size: px(40),
            item_click_func: (cyckleList ,index) => {
                if (index == 0){
                    this.#initNewEventDialog()
                } else if (index == 1){
                    push({
                        url: 'page/list/day',
                        params: {date: new Date(), url: 'page/index'}
                    }) 
                } else if (index == 2){
                    push({
                        url: 'page/calendar',
                    })
                } else if (index == 3) {
                    push({
                        url: 'page/settings/menu',
                    })
                } else if (index == 4) {
                    push({
                        url: 'page/about',
                    })
                }

            },
            item_focus_change_func: (list, index, isFocus) =>{
                pageIngicator.updatePageIndicator(index)
                if (isFocus) {
                    list.setProperty(prop.ITEM_MORE, {
                        index: index,
                        item_text_size: px(45)
                    });
                } else {
                    list.setProperty(prop.ITEM_MORE, {
                        index: index,
                        item_text_size: px(40)
                    });
                }
        }
        })
        cycleList.setProperty(prop.ITEM_MORE, {
            index: 0,
            item_text_size: px(45)
        })
    }
}