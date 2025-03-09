import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

export const formatTime = (time) => {
    const date = new Date(time)
    const timeAgo = new TimeAgo('en-US')
    // time = time.toISOString()
    return timeAgo.format(date - 24 * 60 * 60 * 1000)
}