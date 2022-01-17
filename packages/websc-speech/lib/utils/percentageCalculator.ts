export class PercentageCalculator {
    private _count: number;
    private _correctCount: number;
    private _percentage: number;

    constructor() {
        this._count = 0;
        this._correctCount = 0;
        this._percentage = 0;
    }

    private calculatePercentage() {
        this._percentage = (this._correctCount / this._count * 100);
    }

    increaseCount(correct: boolean) {
        this._count++;
        if (correct) this._correctCount++;
        this.calculatePercentage();
    }

    get percentage() {
        return this._percentage
    }
}
