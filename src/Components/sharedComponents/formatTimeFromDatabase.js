import { format} from 'date-fns';

function formatTimeFromDatabase(dateString) {
    const dbDate = new Date(dateString);

    return format(dbDate, 'dd/MM/yyyy HH:mm:ss');

}

export default formatTimeFromDatabase;
