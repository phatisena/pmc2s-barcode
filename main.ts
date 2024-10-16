namespace SpriteKind {
    export const Barcode = SpriteKind.create()
}
function CheckNumber (Text: string) {
    for (let I = 0; I <= Text.length - 1; I++) {
        if (!("0123456789".includes(Text.charAt(I)))) {
            return false
        }
    }
    return true
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WriteYourSelf) {
        Inum = Math.max(Inum - 1, 0)
    }
})
function FindNormalDecimal (DecT: number[], Mdec: number) {
    J = 0
    for (let value of DecT) {
        if (value < Mdec) {
            return J
        }
        J += 1
    }
    return J
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WriteYourSelf) {
        if (CheckVal > 0) {
            CheckVal += 1
            if (CheckVal > 1) {
                pmcCheckSum = true
            }
            WriteYourSelf = !(ReadyToWritePramaCodeNumber(Itxt, pmcCheckSum))
            if (WriteYourSelf) {
                NotRespond = true
                timer.after(800, function () {
                    NotRespond = false
                })
            }
            CheckVal = 0
        } else {
            CheckVal += 1
        }
    } else {
        if (CheckVal > 0) {
            CheckVal += 1
            if (CheckVal > 1) {
                pmcCheckSum = true
            }
            if (!(ReadyToWritePramaCodeNumber(GenerateNewPramaCodeNum(2, 12), pmcCheckSum))) {
                NotRespond = true
                timer.after(800, function () {
                    NotRespond = false
                })
            }
            CheckVal = 0
        } else {
            CheckVal += 1
        }
    }
})
function CalculatePramaDecimal (NumVal: number, MaxDecimal: number, Reverse: boolean) {
    ND = NumVal
    DecTable = [0]
    NM = 0
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
                for (let J = 0; J <= N - 1; J++) {
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
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WriteYourSelf) {
        Inum = Math.min(Inum + 1, 9)
    }
})
function SumTxtNumListFromPin (UtList: string[], RemDigit: number, CheckSum: boolean, I1: number, I2: number, TileSum: boolean, TileWidth: number) {
    N = 0
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
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WriteYourSelf) {
        if (Itxt.isEmpty()) {
            WriteYourSelf = false
        } else {
            Itxt = BackSpace(Itxt, 1)
        }
    }
})
function AddDecimalTextFromNumber (DecN: any[], Rem: number, Gap: number, Char: string, Cut: boolean) {
    TXT = ""
    I = 0
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
function ReadyToWritePramaCodeNumber (Ntxt: string, CheckSum: boolean) {
    if (WriteNumberToPmc(Ntxt, CheckSum)) {
        TimeToEncodeToPramaCode()
        BarcodeImage = DrawPramaCode(40, 6, 8, true, scene.backgroundColor(), 1, 2, false)
        return true
    }
    return false
}
function GenerateNewPramaCodeNum (Min: number, Max: number) {
    t = ""
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
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WriteYourSelf) {
        if (CheckVal > 0) {
            CheckVal += 1
            if (CheckVal > 1) {
                pmcCheckSum = false
            }
            WriteYourSelf = !(ReadyToWritePramaCodeNumber(Itxt, pmcCheckSum))
            if (WriteYourSelf) {
                NotRespond = true
                timer.after(800, function () {
                    NotRespond = false
                })
            }
            CheckVal = 0
        } else {
            WriteYourSelf = false
        }
    } else {
        if (CheckVal > 0) {
            CheckVal += 1
            if (CheckVal > 1) {
                pmcCheckSum = false
            }
            if (!(ReadyToWritePramaCodeNumber(GenerateNewPramaCodeNum(8, 12), pmcCheckSum))) {
                NotRespond = true
                timer.after(800, function () {
                    NotRespond = false
                })
            }
            CheckVal = 0
        } else {
            Itxt = ""
            Inum = 0
            WriteYourSelf = true
        }
    }
})
function Setup () {
    SetupPramaCode()
}
spriteutils.createRenderable(60, function (screen2) {
    if (NotRespond) {
        images.printCenter(screen2, "UnableToGenerate", scene.screenHeight() / 2, 1)
    } else if (CheckVal > 0) {
        images.printCenter(screen2, "A=Yes AddCheckSum? B=No", scene.screenHeight() / 2, 1)
    } else if (WriteYourSelf) {
        images.printCenter(screen2, "" + Itxt + ("[" + convertToText(Inum) + "]"), scene.screenHeight() / 2, 1)
    }
})
function SumNumList (UnList: any[], RemDigit: number, CheckSum: boolean) {
    N = 0
    for (let value of UnList) {
        N += value
    }
    if (CheckSum) {
        return (RemDigit - N % RemDigit) % RemDigit
    }
    return N
}
function SumTxtNumList (UtList: string[], RemDigit: number, CheckSum: boolean) {
    N = 0
    for (let value of UtList) {
        N += parseFloat(value)
    }
    if (CheckSum) {
        return (RemDigit - N % RemDigit) % RemDigit
    }
    return N
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WriteYourSelf) {
        Itxt = "" + Itxt + convertToText(Inum)
    }
})
function DrawPramaCode (Hight: number, GapWidth: number, GapHight: number, Text: boolean, Bcol: number, Wcol: number, Twidth: number, Border: boolean) {
    PmcImgWidth = SumTxtNumListFromPin(PmcL, 0, false, 0, 1, true, Twidth)
    PmcImg = image.create(PmcImgWidth, Hight)
    PmcImg.fill(Wcol)
    WidthI = 0
    for (let value of PmcL) {
        Cidx = PmcPin[0].indexOf(value)
        PmcTi = PmcPin[2][Cidx]
        PmcWi = parseFloat(PmcPin[1][Cidx])
        for (let J = 0; J <= PmcTi.length - 1; J++) {
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
    BGpmcImg = image.create(GapWidth * 2 + PmcImgWidth, GapHight * 2 + Hight)
    BGpmcImg.fill(Wcol)
    spriteutils.drawTransparentImage(PmcImg.clone(), BGpmcImg, GapWidth, GapHight)
    if (Text) {
        images.printCenter(BGpmcImg, PmcHumanText, GapHight + (Hight - 8), Bcol)
    }
    if (Border) {
        BGpmcImg.fillRect(0, 0, GapWidth * 2 + PmcImgWidth, GapHight, Bcol)
        BGpmcImg.fillRect(0, GapHight + (Hight - 8), GapWidth * 2 + PmcImgWidth, GapHight + (Hight - (Hight - 8)), Bcol)
        if (Text) {
            images.printCenter(BGpmcImg, PmcHumanText, GapHight + (Hight - 7), Wcol)
        }
        BGpmcImg.drawRect(0, 0, GapWidth * 2 + PmcImgWidth, GapHight * 2 + Hight, Wcol)
    }
    return BGpmcImg
}
function SetupTextList (Text: string) {
    UtxtList = []
    for (let I = 0; I <= Text.length - 1; I++) {
        UtxtList.push(Text.charAt(I))
    }
    return UtxtList
}
function WriteNumberToPmc (Text: string, CheckSum: boolean) {
    if (CheckNumber(Text)) {
        if (convertToText(parseFloat(Text)).includes(CharOfError)) {
            return false
        }
        PmcTval = Text
        PmcHumanText = convertToText(parseFloat(Text))
        UtxtList = SetupTextList(Text)
        Tval = AddDecimalTextFromNumber(UtxtList, 1, 2, "2", true)
        if (CheckSum) {
            SumN = SumTxtNumList(UtxtList, 10, true)
            Tval = "" + AddDecimalTextFromNumber(UtxtList, 1, 2, "2", true) + convertToText(SumN)
            PmcHumanText = "" + PmcHumanText + convertToText(SumN)
            UtxtList = SetupTextList(Tval)
        }
        return true
    }
    return false
}
function SetupPramaCode () {
    PmcPin = [[
    "0",
    "1",
    "2",
    "3"
    ], [
    "0",
    "1",
    "2",
    "3"
    ], [
    "10",
    "01",
    "11",
    "00"
    ]]
}
function BackSpace (PmcTxt: string, BackCount: number) {
    t = ""
    for (let I = 0; I <= PmcTxt.length - 1; I++) {
        if (I < PmcTxt.length - BackCount) {
            t = "" + t + PmcTxt.charAt(I)
        }
    }
    return t
}
function TimeToEncodeToPramaCode () {
    BinTable = CalculatePramaDecimal(parseFloat(Tval), 2, true)
    PmcT = AddDecimalTextFromNumber(BinTable, 1, 0, "3", false)
    PmcL = SetupTextList(PmcT)
    PmcT = AddDecimalTextFromNumber(PmcL, 1, 0, "3", true)
    PmcL = SetupTextList(PmcT)
}
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
let PmcPin: string[][] = []
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
let CharOfError = ""
scene.setBackgroundColor(15)
CharOfError = "."
Setup()
ReadyToWritePramaCodeNumber(GenerateNewPramaCodeNum(2, 12), true)
let SetupDone = true
WriteYourSelf = false
CheckVal = 0
game.onUpdate(function () {
    if (SetupDone) {
        if (!(BarcodeSprite)) {
            BarcodeSprite = sprites.create(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, SpriteKind.Barcode)
        }
        BarcodeSprite.setImage(BarcodeImage)
        BarcodeSprite.x = scene.screenWidth() / 2
        BarcodeSprite.top = 0
    }
})
