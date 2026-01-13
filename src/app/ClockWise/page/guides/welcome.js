import { createWidget, widget, align } from '@zos/ui'
import { push } from '@zos/router'
import { styleColors } from "../../utils/Constants"
import { getText } from '@zos/i18n'

Page({
    onInit(){
        createWidget(widget.TEXT, {
            text: getText('Welcome')+ '👋',
            w: 480,
            x: 0,
            align_h: align.CENTER_H,
            y: 80,
            text_size: 40,
            color: styleColors.white
        })        

        createWidget(widget.TEXT, {
            text: getText('to') + ' ' + 'ClockWise!',
            align_h: align.CENTER_H,
            w: 480,
            x: 0,
            y: 160,
            text_size: 40,
            color: styleColors.white
        })
        createWidget(widget.TEXT, {
            text: getText('Quick intro ahead') + '?',
            align_h: align.CENTER_H,
            w: 480,
            x: 0,
            y: 240,
            text_size: 40,
            color: styleColors.white
        })                
        createWidget(widget.BUTTON, {
            x: 0,
            y: 340,
            w: 480,
            h: 130,
            radius: 30,
            normal_color: styleColors.dark_gray,
            press_color: styleColors.blue_violet,
            text: getText('Get started') + '🚀',
            text_size: 38,
            click_func: () => {
                push({ url: 'page/guides/step_0' })
            }
        })
    }
})