import React from 'react'

import { toPng } from 'html-to-image';

import EmptyCard from './EmptyCard';
import styles from './Calendar.module.css'
import Card from './Card';

type CalendarProps = {}

type CalendarState = {
    days: { [day: number]: string },
    description: string,
    year: number,
    month: number,
    headerFontSize: number,
    firstWeekDay: number,
}

class Calendar extends React.Component<CalendarProps, CalendarState> {
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

    private calendarMainRef = React.createRef<HTMLDivElement>();

    public constructor(props: CalendarProps) {
        super(props);
        this.state = {
            days: {},
            description: "",
            month: 0,
            year: 2024,
            headerFontSize: 30,
            firstWeekDay: 1
        };
    }

    private monthChange(e: any) {
        this.setState({
            month: +e.target.value
        });
    }

    private onYearUpdate(e: any) {
        const val = +e.target.value;
        if (Number.isNaN(val)) {
            return;
        }
        this.setState({
            year: val
        });
    }

    private generateImage() {
        toPng(this.calendarMainRef.current as HTMLElement, { cacheBust: false })
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

    private generateHeader() {
        let headerDays = [];
        for (var i = 0; i < 7; i++) {
            headerDays.push(Calendar.DAYS[((i + this.state.firstWeekDay) % 7)])
        }
        return (<>
            {headerDays.map(d => <div className={styles.dayCard} style={{ fontSize: this.state.headerFontSize }} key={`${d}`}>{d}</div>)}
        </>)
    }

    private generatePreviousMonthEmptyCards() {
        const firstDayOfMonth = new Date(this.state.year, this.state.month, 1);
        return (<>
            {[...Array(firstDayOfMonth.getDay() + 7 - this.state.firstWeekDay)].map((x, i) => <EmptyCard key={i} />)}
        </>)
    }

    private onCardTextChange(day: number, val: string) {
        const newDays = this.state.days;
        newDays[day] = val;
        this.setState({ days: newDays });
    }

    private generateCards() {
        let days = []
        for (let d = new Date(this.state.year, this.state.month, 1); d.getMonth() === this.state.month; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d));
        }
        return (<>
            {days.map(date => {
                return <Card key={`${date}`} date={date} text={this.state.days[date.getDate()]} onTextChange={this.onCardTextChange.bind(this)} />
            })}
        </>)
    }

    private onDescriptionChange(e: any) {
        this.setState({
            description: e.target.value
        });
    }

    private saveConfig() {
        const config = {
            description: this.state.description,
            year: this.state.year,
            month: this.state.month + 1,
            days: this.state.days,
            headerFontSize: this.state.headerFontSize,
            firstWeekDay: this.state.firstWeekDay,
        };
        const filePath = `${this.state.month + 1}_${this.state.year}_config.json`;
        const fileData = JSON.stringify(config, null, "  ");
        const blob = new Blob([fileData], { type: "application/json" });
        const dataUrlToSave = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filePath;
        link.href = dataUrlToSave;
        link.click();
    }

    private async loadConfiguration(e: any) {
        const file = e.target.files[0];
        const text = await file.text();
        const config = JSON.parse(text);
        const month = config.month - 1;
        this.setState({
            description: config.description,
            year: config.year,
            month: month,
            days: config.days,
            headerFontSize: config.headerFontSize,
            firstWeekDay: config.firstWeekDay
        });
    }

    render() {
        return (
            <div>
                <div ref={this.calendarMainRef} className={styles.calendarMain}>
                    <div className={styles.calendarHeader}>
                        <div>{Calendar.MONTHS[this.state.month]}</div>
                        <textarea className={styles.textareaLegend} cols={50} rows={4} value={this.state.description} onChange={this.onDescriptionChange.bind(this)}></textarea>
                    </div>
                    <div className={styles.calendarContainer}>
                        {this.generateHeader()}
                        {this.generatePreviousMonthEmptyCards()}
                        {this.generateCards()}
                    </div>
                </div>
                <div className={styles.userPanel}>
                    <div className={styles.basicPanel}>
                        <select className={styles.monthSelector} value={this.state.month} onChange={this.monthChange.bind(this)}>
                            {Calendar.MONTHS.map((x, i) => <option value={i} key={i}>{x}</option>)}
                        </select>
                        <input className={styles.generateButton} type='text' maxLength={4} placeholder='YYYY' value={this.state.year} onChange={this.onYearUpdate.bind(this)} />
                        <button className={styles.generateButton} onClick={this.generateImage.bind(this)}>Generuj</button>
                        <button className={styles.generateButton} onClick={this.saveConfig.bind(this)}>Zapisz</button>
                        <div>
                            <button className={styles.generateButton}><label htmlFor="file">Załaduj</label></button>
                            <input type="file" id="file" accept='application/JSON' style={{ display: "none" }} onChange={this.loadConfiguration.bind(this)} />
                        </div>
                    </div>
                    <div className={styles.basicPanel}>
                        <label htmlFor="file">Naglówek: </label>
                        <input type="number" id="file" value={this.state.headerFontSize} onChange={e => this.setState({ headerFontSize: +e.currentTarget.value })} />
                    </div>
                    <div className={styles.basicPanel}>
                        <label htmlFor="file">Pierwszy dzień: </label>
                        <select value={this.state.firstWeekDay} onChange={e => this.setState({ firstWeekDay: +e.currentTarget.value })}>
                            {Calendar.DAYS.map((x, i) => <option value={i} key={i}>{x}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        )
    }
}

export default Calendar;
