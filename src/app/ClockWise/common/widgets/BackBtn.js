import { createWidget, widget } from '@zos/ui'
import { getText } from '@zos/i18n'
import { push } from '@zos/router'
import { px } from '@zos/utils'
import { styleColors } from '../../utils/Constants'

export class BackBtn {
    static renderBackBtn(text, url){
        return createWidget(widget.BUTTON, {
            x: px(40),
            y: px(400),
            w: px(400),
            h: px(80),
            radius: px(0),
            normal_color: styleColors.dark_gray,
            press_color: styleColors.blue_violet,
            text: getText(text),
            text_size: px(32),
            click_func: () => {
                push ({
                    url: url
                })
            }
        })
    }
}