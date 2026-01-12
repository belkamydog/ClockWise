import { createWidget, widget, prop, anim_status, align} from '@zos/ui'
import { push } from '@zos/router'
import { styleColors } from "../../utils/Constants"
import { getText } from '@zos/i18n'
import { SettingsService } from '../../utils/services/SettingsService'

Page({
    onInit(){
        const imgAnimation = createWidget(widget.IMG_ANIM, {
                anim_path: 'animation/guides/guide4',
                anim_prefix: 'a',
                anim_ext: 'png',
                anim_fps: 1,
                anim_size: 4,
                repeat_count: 0,
                anim_status: 3,
                x: 0,
                y: 0,
                anim_complete_call: () => {
                    console.log('animation complete')
                }
        })
        imgAnimation.setProperty(prop.ANIM_STATUS, anim_status.START)
        createWidget(widget.BUTTON, {
            x: 0,
            y: 370,
            w: 480,
            h: 110,
            radius: 0,
            normal_color: styleColors.dark_gray,
            press_color: styleColors.blue_violet,
            text: getText('Done'),
            text_size: 35,
            click_func: () => {
                push({ url: 'page/index' })
                let settings = SettingsService.loadSettings()
                settings.studyMode = false
                SettingsService.saveSettings(settings)
            }
        })
    }
})