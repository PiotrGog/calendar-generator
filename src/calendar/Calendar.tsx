import React from 'react'

import EmptyCard from './EmptyCard';
import styles from './Calendar.module.css'
import Card from './Card';

type CalendarState = {
    days: Date[]
}

class Calendar extends React.Component<{}, CalendarState> {
    static DAYS: string[] = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

    constructor(props: any) {
        super(props);
        const month = 10;

        let days = []
        for (let d = new Date(2024, month, 1); d.getMonth() === month; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d));
        }

        this.state = {
            days: days
        };
    }

    render() {
        return (
            <div className={styles.calendarMain}>
                <div className={styles.calendarContainer}>
                    {Calendar.DAYS.map(d =>
                        <div className={styles.dayCard} key={`${d}`}>{d}</div>
                    )}
                    {[...Array(this.state.days[0].getDay())].map((x, i) => <EmptyCard key={i} />
                    )}
                    {this.state.days.map(d =>
                        <Card key={`${d}`} date={d} />
                    )}
                </div>
            </div>
        )
    }
}

export default Calendar;
