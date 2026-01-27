import { createWidget, widget, align } from '@zos/ui'
import { getText } from '@zos/i18n'
import { px } from '@zos/utils'
import { styleColors } from '../../utils/Constants'

export class PageTitle {
    static renderTitle(titleText){
        return createWidget(widget.TEXT, {
            text: getText(titleText),
            x: px(0),
            y: px(50),
            w: px(480),
            h: px(50),
            text_size: px(40),
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.dodger_blue,
        })
    }
}