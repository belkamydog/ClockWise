import { createWidget, widget, align } from '@zos/ui'
import { getText } from '@zos/i18n'
import { styleColors } from '../../utils/Constants'

export class PageTitle {
    static renderTitle(titleText){
        return createWidget(widget.TEXT, {
            text: getText(titleText),
            x: 0,
            y: 50,
            w: 480,
            h: 50,
            text_size: 40,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.dodger_blue,
        })
    }
}