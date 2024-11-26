import React from 'react'

import { toPng } from 'html-to-image';

import EmptyCard from './EmptyCard';
import styles from './Calendar.module.css'
import Card from './Card';

type CalendarState = {
    days: Date[]
}

class Calendar extends React.Component<{}, CalendarState> {
    static DAYS: string[] = [
        'Niedziela',
        'Poniedziałek',
        'Wtorek',
        'Środa',
        'Czwartek',
        'Piątek',
        'Sobota'
    ];
    static MONTHS: string[] = [
        'Styczeń',
        'Luty',
        'Marzec',
        'Kwiecień',
        'Maj',
        'Czerwiec',
        'Lipiec',
        'Sierpień',
        'Wrzesień',
        'Październik',
        'Listopad',
        'Grudzień'
    ];

    private elementRef = React.createRef<HTMLDivElement>();
    private month: number = 0;
    private year: number = 2024;

    constructor(props: any) {
        super(props);
        this.state = {
            days: this.prepareDaysForCurrentMonth()
        };
    }

    monthChange(e: any) {
        this.month = +e.target.value;

        this.setState({
            days: this.prepareDaysForCurrentMonth()
        });
    }

    onYearUpdate(e: any) {
        if (e.target.value.length !== 4) {
            return;
        }
        this.year = +e.target.value;
        this.setState({
            days: this.prepareDaysForCurrentMonth()
        });
    }

    prepareDaysForCurrentMonth() {
        let days = []
        for (let d = new Date(this.year, this.month, 1); d.getMonth() === this.month; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d));
        }
        return days;
    }

    generateImage() {
        toPng(this.elementRef.current as HTMLElement, { cacheBust: false })
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = "my-image-name.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <div ref={this.elementRef} className={styles.calendarMain}>
                    <div className={styles.calendarHeader}>{Calendar.MONTHS[this.month]}</div>
                    <div className={styles.calendarContainer}>
                        {Calendar.DAYS.map(d =>
                            <div className={styles.dayCard} key={`${d}`}>{d}</div>
                        )}
                        {[...Array(this.state.days[0].getDay())].map((x, i) => <EmptyCard key={i} />
                        )}
                        {this.state.days.map(d => {
                            return <Card key={`${d}`} date={d} />
                        })}
                    </div>
                </div>
                <div className={styles.userPanel}>
                    <select className={styles.monthSelector} onChange={this.monthChange.bind(this)}>
                        {Calendar.MONTHS.map((x, i) =>
                            <option value={i} key={i}>{x}</option>
                        )}
                    </select>
                    <input className={styles.generateButton} type='number' maxLength={4} placeholder='YYYY' min={1900} onChange={this.onYearUpdate.bind(this)} />
                    <button className={styles.generateButton} onClick={this.generateImage.bind(this)}>Generuj</button>
                </div>
            </div>
        )
    }
}

export default Calendar;
