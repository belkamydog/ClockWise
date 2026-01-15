import { createWidget, widget } from '@zos/ui'
import { push } from '@zos/router'
import { getText } from '@zos/i18n'
import { styleColors } from '../../utils/Constants'

export class BackBtn {
    static renderBackBtn(text, url){
        return createWidget(widget.BUTTON, {
            x: 40,
            y: 400,
            w: 400,
            h: 80,
            radius: 0,
            normal_color: styleColors.dark_gray,
            press_color: styleColors.blue_violet,
            text: getText(text),
            text_size: 32,
            click_func: () => {
                push ({
                    url: url
                })
            }
        })
    }
}