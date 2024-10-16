namespace pharmar2stack {
    let BarcodeSprite: Sprite = null
    let PmcT = ""
    let BinTable: number[] = []
    let SumN = 0
    let Tval = ""
    let PmcTval = ""
    let UtxtList: string[] = []
    let PmcHumanText = ""
    let BGpmcImg: Image = null
    let PmcTile = 0
    let PmcWi = 0
    let PmcTi = ""
    let WidthI = 0
    let PmcImg: Image = null
    let PmcL: string[] = []
    let PmcImgWidth = 0
    let t = ""
    let BarcodeImage: Image = null
    let I = 0
    let TXT = ""
    let Cidx = 0
    let C = ""
    let NL = 0
    let N = 0
    let NM = 0
    let DecTable: number[] = []
    let ND = 0
    let NotRespond = false
    let Itxt = ""
    let pmcCheckSum = false
    let J = 0
    let Inum = 0
    let CheckVal = 0
    let WriteYourSelf = false
    let CharOfError = "."
    let SetupDone = true
    let PmcPin: string[][] = [["0","1","2","3"], ["0","1","2","3"], ["10","01","11","00"]]

    export function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) {
            return;
        }
        to.drawTransparentImage(src, x, y);
    }

    export function print(i: Image, text: string, x: number, y: number, color: number) {
        i.print(text, x, y, color)
    }

    export function printCenter(i: Image, text: string, y: number, color: number) {
        i.printCenter(text, y, color)
    }
    
    export function CheckNumber (Text: string) {
        for (let I = 0; I <= Text.length - 1; I++) {
            if (!("0123456789".includes(Text.charAt(I)))) {
                return false
            }
        }
        return true
    }

    export function GenerateNewPramaCodeNum (Min: number, Max: number) {
        let t = ""
        let N = 0
        for (let I = 0; I <= randint(Min, Max) - 1; I++) {
            N = randint(1, 9)
            if (I > 0) {
                N = randint(0, 9)
            }
            if (("" + t + convertToText(N)).length < 6) {
                t = "" + t + convertToText(N)
            }
        }
        return t
    }

    export function SumTxtNumListFromPin (UtList: string[], RemDigit: number, CheckSum: boolean, I1: number, I2: number, TileSum: boolean, TileWidth: number) {
        let N = 0
        let C = ""
        let Cidx = 0
        for (let value of UtList) {
            C = value
            Cidx = PmcPin[I1].indexOf(C)
            if (TileSum) {
                N += TileWidth
            } else {
                N += parseFloat(PmcPin[I2][Cidx])
            }
        }
        if (TileSum) {
            N += 0 - TileWidth
        }
        if (CheckSum) {
            return (RemDigit - N % RemDigit) % RemDigit
        }
        return N
    }

    export function SetupTextList (Text: string) {
        let UtxtList: string[] = []
        for (let I = 0; I < Text.length; I++) {
            UtxtList.push(Text.charAt(I))
        }
        return UtxtList
    }

    export function AddDecimalTextFromNumber (DecN: number[], Rem: number, Gap: number, Char: string, Cut: boolean) {
        let TXT = ""
        let I = 0
        for (let value of DecN) {
            TXT = "" + TXT + convertToText(value)
            if (Cut) {
                if (I % Rem == Gap) {
                    TXT = "" + TXT + Char
                }
            }
            I += 1
        }
        return TXT
    }
    
    export function FindNormalDecimal (DecT: number[], Mdec: number) {
        let J = 0
        for (let value of DecT) {
            if (value < Mdec) {
                return J
            }
            J += 1
        }
        return J
    }

    export function CalculatePramaDecimal (NumVal: number, MaxDecimal: number, Reverse: boolean) {
        let ND = NumVal
        let DecTable: number[] = [0]
        let NM = 0
        let N = 0
        let NL = 0
        for (let index = 0; index < ND - 1; index++) {
            N = FindNormalDecimal(DecTable, MaxDecimal)
            if (N > DecTable.length - 1) {
                NL = DecTable.length + 1
                DecTable = []
                for (let index = 0; index < NL; index++) {
                    DecTable.push(0)
                }
            } else {
                DecTable[N] = 1 + DecTable[N]
                if (N - 1 >= 0) {
                    for (let J = 0; J < N; J++) {
                        DecTable[J] = 0
                    }
                }
            }
        }
        if (Reverse) {
            DecTable.reverse()
        }
        return DecTable
    }

    export function ReadyToWritePramaCodeNumber (Ntxt: string, CheckSum: boolean) {
        if (WriteNumberToPmc(Ntxt, CheckSum)) {
            TimeToEncodeToPramaCode()
            BarcodeImage = DrawPramaCode(40, 6, 8, true, scene.backgroundColor(), 1, 2, false)
            return true
        }
        return false
    }

    export function Setup () {
        SetupPramaCode()
    }

    export function SumNumList (UnList: number[], RemDigit: number, CheckSum: boolean) {
        let N = 0
        for (let value of UnList) {
            N += value
        }
        if (CheckSum) {
            return (RemDigit - N % RemDigit) % RemDigit
        }
        return N
    }
    export function SumTxtNumList (UtList: string[], RemDigit: number, CheckSum: boolean) {
        let N = 0
        for (let value of UtList) {
            N += parseFloat(value)
        }
        if (CheckSum) {
            return (RemDigit - N % RemDigit) % RemDigit
        }
        return N
    }

    export function DrawPramaCode (Hight: number, GapWidth: number, GapHight: number, Text: boolean, Bcol: number, Wcol: number, Twidth: number, Border: boolean) {
        let PmcImgWidth = SumTxtNumListFromPin(PmcL, 0, false, 0, 1, true, Twidth)
        let PmcImg = image.create(PmcImgWidth, Hight)
        PmcImg.fill(Wcol)
        let WidthI = 0
        let PmcTi = ""
        let PmcWi = 0
        let Cidx = 0
        let PmcTile = 0
        for (let value of PmcL) {
            Cidx = PmcPin[0].indexOf(value)
            PmcTi = PmcPin[2][Cidx]
            PmcWi = parseFloat(PmcPin[1][Cidx])
            for (let J = 0; J < PmcTi.length; J++) {
                PmcTile = (Hight - 8) / PmcTi.length
                if (!(Text)) {
                   PmcTile = Hight / PmcTi.length
                }
                if (parseFloat(PmcTi.charAt(J)) == 1) {
                    if (!(Text)) {
                        PmcImg.fillRect(WidthI, Hight - PmcTile * (J + 1), Twidth, PmcTile, Bcol)
                    } else {
                        PmcImg.fillRect(WidthI, Hight - 8 - PmcTile * (J + 1), Twidth, PmcTile, Bcol)
                    }
                }
            }
            WidthI += Twidth
        }
        let BGpmcImg = image.create(GapWidth * 2 + PmcImgWidth, GapHight * 2 + Hight)
        BGpmcImg.fill(Wcol)
        drawTransparentImage(PmcImg.clone(), BGpmcImg, GapWidth, GapHight)
        if (Text) {
            printCenter(BGpmcImg, PmcHumanText, GapHight + (Hight - 8), Bcol)
        }
        if (Border) {
            BGpmcImg.fillRect(0, 0, GapWidth * 2 + PmcImgWidth, GapHight, Bcol)
            BGpmcImg.fillRect(0, GapHight + (Hight - 8), GapWidth * 2 + PmcImgWidth, GapHight + (Hight - (Hight - 8)), Bcol)
            if (Text) {
                printCenter(BGpmcImg, PmcHumanText, GapHight + (Hight - 7), Wcol)
            }
            BGpmcImg.drawRect(0, 0, GapWidth * 2 + PmcImgWidth, GapHight * 2 + Hight, Wcol)
        }
        return BGpmcImg
    }
    
    export function WriteNumberToPmc (Text: string, CheckSum: boolean) {
        if (CheckNumber(Text)) {
            if (convertToText(parseFloat(Text)).includes(CharOfError)) {
                return false
            }
            let PmcTval: string = Text
            let PmcHumanText: string = convertToText(parseFloat(Text))
            let UtxtList: string[] = SetupTextList(Text)
            let Tval: string = AddDecimalTextFromNumber(UtxtList, 1, 2, "2", true)
            if (CheckSum) {
                let SumN: number = SumTxtNumList(UtxtList, 10, true)
                Tval = "" + AddDecimalTextFromNumber(UtxtList, 1, 2, "2", true) + convertToText(SumN)
                PmcHumanText = "" + PmcHumanText + convertToText(SumN)
                UtxtList = SetupTextList(Tval)
            }
            return true
        }
        return false
    }
    
    export function TimeToEncodeToPramaCode () {
        let BinTable: number[] = CalculatePramaDecimal(parseFloat(Tval), 2, true)
        let PmcT: string = AddDecimalTextFromNumber(BinTable, 1, 0, "3", false)
        let PmcL: string[] = SetupTextList(PmcT)
        PmcT = AddDecimalTextFromNumber(PmcL, 1, 0, "3", true)
        PmcL = SetupTextList(PmcT)
    }

}
