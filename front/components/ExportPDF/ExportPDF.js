import React from 'react';
import { jsPDF } from "jspdf";
import { toJpeg } from 'html-to-image';

const SavePDF = ({ items, setItems, setItemSelected, projectName, elementToSave, setScale }) => {

    const toPdf = async () => {
        setItemSelected(null);
        const validItems = getValidItems();
        setItems(validItems);
        await setScale(1);
        const data = await document.querySelector(elementToSave);

        toJpeg(data).then(async (imgUrl) => {          
            const pdf = new jsPDF("portrait", "px", "a4");
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            const timeElapsed = Date.now();
            const today = new Date(timeElapsed);

            pdf.addImage(imgUrl, 'PNG', 0, 0, width, height);
            pdf.save(`${projectName} ${today.toISOString()}.pdf`);
          });
    }

    const getValidItems = () => {
       return items.filter((item) => {
            switch (item.type) {
                case "image":
                    if (!item.file) return false;
                    return true;
                case "textzone":
                    if (item.content === "") return false;
                    return true;
                default:
                    return true;
            }
        })
    }

    return (
        <button type="button" onClick={toPdf}>Export PDF</button>
    )
}

export default SavePDF;