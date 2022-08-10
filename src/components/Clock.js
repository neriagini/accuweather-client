import { format } from 'date-fns'
const { utcToZonedTime } = require('date-fns-tz');

export default function Clock({time, city ,tz}) {
    

    const timeZone = tz
    const zonedDate = utcToZonedTime(time, timeZone)

    return(
        <div className="m-5 bg-blue-500 rounded-xl p-5">
            <p className="font-bold text-white"> {city} </p>
            <p className="text-white">
            {format(zonedDate, 'dd/MM/yyyy HH:mm:ss')}
            </p>
        </div>
    )
}