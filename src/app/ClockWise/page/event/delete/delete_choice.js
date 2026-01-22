import { createWidget, widget, prop, align } from '@zos/ui'
import { getText } from '@zos/i18n'
import { styleColors } from '../../../utils/Constants';
import { eventServise } from '../../../utils/Globals';
import { push } from '@zos/router'
import {log} from '@zos/utils'
import { BackBtn } from '../../../common/widgets/backBtn';
import { PageTitle } from '../../../common/widgets/PageTitle'

const logger = log.getLogger('delete_choice.js')

Page({
    choice: ['All repeats', 'Current event'],
    widgets: {
        title: null,
        backBtn: null,
    },

    onInit(params){
        logger.log('Init delete choice page with params: ' + params)
        this.widgets.title = PageTitle.renderTitle('Delete ?')
        this.widgets.title.color = styleColors.crimson
        const { id, date, goBackUrl} = JSON.parse(params)
        createWidget(widget.BUTTON, {
            x: 0,
            y: 130,
            w: 480,
            h: 100,
            radius: 0,
            normal_color: styleColors.dark_red,
            press_color: styleColors.blue_violet,
            text: '❌ ' + getText('Current event'),
            text_size: 40,
            click_func: () => {
                eventServise.deleteRepeatOfEvent(id, date)
                push ({
                    url: goBackUrl
                })
            }
        })
        createWidget(widget.BUTTON, {
            x: 0,
            y: 270,
            w: 480,
            h: 100,
            radius: 0,
            normal_color: styleColors.dark_red,
            press_color: styleColors.blue_violet,
            text: '❌ ' + getText('All repeats'),
            text_size: 40,
            click_func: () => {
                eventServise.deleteEvent(id)
                push ({
                    url: goBackUrl
                })
            }
        })

        this.widgets.backBtn = BackBtn.renderBackBtn('Cancel', 'page/index')

    }
})