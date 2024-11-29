import React from 'react'

import { toPng } from 'html-to-image';

import EmptyCard from './EmptyCard';
import styles from './Calendar.module.css'
import Card from './Card';

type CalendarProps = {}

type CardData = {
    date: Date,
    text: string
}

type CalendarState = {
    days: CardData[],
    description: string,
    year: number,
    month: number
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
    private cardRefs: React.RefObject<Card>[] = [];

    public constructor(props: CalendarProps) {
        super(props);
        this.state = {
            days: [],
            description: "",
            month: 0,
            year: 2024
        };

    }

    public componentDidMount() {
        this.setState({
            days: this.prepareDaysForCurrentMonth()
        });
    }

    private monthChange(e: any) {
        this.setState({
            month: +e.target.value
        });

        this.setState({
            days: this.prepareDaysForCurrentMonth()
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
        if (e.target.value.length !== 4) {
            return;
        }
        this.setState({
            days: this.prepareDaysForCurrentMonth()
        });
    }

    private prepareDaysForCurrentMonth() {
        let days = []
        this.cardRefs = [];
        for (let d = new Date(this.state.year, this.state.month, 1); d.getMonth() === this.state.month; d.setDate(d.getDate() + 1)) {
            days.push({ date: new Date(d), text: "" });
            this.cardRefs.push(React.createRef<Card>());
        }
        return days;
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
        return (<>
            {Calendar.DAYS.map(d => <div className={styles.dayCard} key={`${d}`}>{d}</div>)}
        </>)
    }

    private generatePreviousMonthEmptyCards() {
        if (this.state.days.length === 0) {
            return <></>
        }
        return (<>
            {[...Array(this.state.days[0].date.getDay())].map((x, i) => <EmptyCard key={i} />)}
        </>)
    }

    private generateCards() {
        return (<>
            {this.state.days.map((card, i) => {
                return <Card ref={this.cardRefs[i]} key={`${card.date}`} date={card.date} text={card.text} />
            })}
        </>)
    }

    private onDescriptionChange(e: any) {
        this.setState({
            description: e.target.value
        });
    }

    private saveConfig() {
        const days = Object.fromEntries(this.cardRefs.map((cardRef, i) => [cardRef.current?.getDay(), cardRef.current?.getText()]));
        const config = {
            description: this.state.description,
            year: this.state.year,
            month: this.state.month + 1,
            days: days
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
            days: []
        });

        let days = []
        this.cardRefs = [];
        for (let d = new Date(config.year, month, 1); d.getMonth() === month; d.setDate(d.getDate() + 1)) {
            const a: CardData = {
                date: new Date(d), text: config.days[d.getDate()]
            }
            days.push(a);
            this.cardRefs.push(React.createRef<Card>());
        }
        this.setState({
            description: config.description,
            year: config.year,
            month: month,
            days: days
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
                    <select className={styles.monthSelector} value={this.state.month} onChange={this.monthChange.bind(this)}>
                        {Calendar.MONTHS.map((x, i) => <option value={i} key={i}>{x}</option>)}
                    </select>
                    <input className={styles.generateButton} type='text' maxLength={4} placeholder='YYYY' value={this.state.year} onChange={this.onYearUpdate.bind(this)} />
                    <button className={styles.generateButton} onClick={this.generateImage.bind(this)}>Generuj</button>
                    <button className={styles.generateButton} onClick={this.saveConfig.bind(this)}>Zapisz</button>
                    <div>
                        <button className={styles.generateButton}><label htmlFor="file">Załaduj</label></button>
                        <input type="file" name="file" id="file" accept='application/JSON' style={{ display: "none" }} onChange={this.loadConfiguration.bind(this)} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Calendar;
