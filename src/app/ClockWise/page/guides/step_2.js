import { createWidget, widget, prop, anim_status, align} from '@zos/ui'
import { push } from '@zos/router'
import { styleColors } from "../../utils/Constants"
import { getText } from '@zos/i18n'

Page({
    onInit(){
     const imgAnimation = createWidget(widget.IMG_ANIM, {
            anim_path: 'animation/guides/guide3',
            anim_prefix: 'a',
            anim_ext: 'png',
            anim_fps: 2,
            anim_size: 3,
            repeat_count: 0,
            anim_status: 3,
            x: 0,
            y: 0,
            anim_complete_call: () => {
                console.log('animation complete')
            }
    })
    imgAnimation.setProperty(prop.ANIM_STATUS, anim_status.START)
        createWidget(widget.TEXT, {
            text: getText('Back'),
            w: 480,
            x: 0,
            y: 70,
            align_h: align.CENTER_H,
            text_size: 40
        })
        createWidget(widget.BUTTON, {
            x: 0,
            y: 370,
            w: 480,
            h: 110,
            radius: 0,
            normal_color: styleColors.dark_gray,
            press_color: styleColors.blue_violet,
            text: getText('Next'),
            text_size: 35,
            click_func: () => {
                push({ url: 'page/guides/step_3' })
            }
        })
    }
})