ChatWindow.prototype.ExportTOCSV = function (content,intentCode,file_name, buttonClick) {

                                                try {

                                                                if (!buttonClick) {

                                                                                console.log("no button click",intentCode);

                                                                                

                                                                                this.AddButtonToBotMessage(content,intentCode,"EXPORT","POPUP");

                                                                                

                                                                                

                                                                }

                                                                

                                                                var filename = file_name || "DataExported";

                                                                try {

                                                                                var currentDate = new Date()

                                                                                filename += "_" + currentDate.format('ddmmmyyyyHHMMss').toUpperCase();

                                                                } catch (err) {

                                                                                

                                                                                filename = file_name || "DataExported";

                                                                }

                                                                                                console.log("ExportTOCSV",content);

                                                                var rows = content.split("\\n");

                                                                filename = "DataExported" + ".csv";

                                                                var BOM = "\uFEFF";

                                                                var csvData = BOM + rows.join('\n');

                                                                var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

 

                                                                if (navigator.msSaveBlob) {

                                                                                navigator.msSaveBlob(blob, filename);

                                                                } else {

                                                                                var link = document.createElement("a");

                                                                                if (link.download !== undefined) {

                                                                                                var url = URL.createObjectURL(blob);

                                                                                                link.setAttribute("href", url);

                                                                                                link.setAttribute("download", filename);

                                                                                                link.style.visibility = 'hidden';

                                                                                                document.body.appendChild(link);

                                                                                                link.click();

                                                                                                document.body.removeChild(link);

                                                                                }

                                                                }

                                                } catch (error) {

                                                                console.log("Error:" + error);

                                                }

                                };

 if(dataObj.ReqDetails){

                                                                                                                                var json2csvParser = new Json2csvParser({ header: true });//to remove the first line header part of csv data

                                                                                                                                var expData = resp[intentAction.exportDataProp] || dataObj.ReqDetails;

                                                                                                                                //var expData = resp[intentAction.exportDataProp] || resp.items;

                                                                                                                                var orderDetails = json2csvParser.parse(expData);

                                                                                                                                console.log("expDta",expData);

                                                                                                                                outResp = {

                                                                                                                                                outputText: constants.DOWNLOAD_CSV_MSG,

                                                                                                                                                responseType: constants.RESPONSE_CSV,

                                                                                                                                                CSVData: orderDetails,

                                                                                                                                                popData:POData

                                                                                                                                };

