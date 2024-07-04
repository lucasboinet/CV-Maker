import { BiFontColor, BiImageAdd, BiBold } from 'react-icons/bi';
import { MdFormatColorFill, MdBorderColor } from 'react-icons/md';
import { BsAspectRatio, BsBorderStyle, BsBorderWidth, BsTextarea, BsFonts } from 'react-icons/bs';
import { FiRotateCcw } from 'react-icons/fi';
import { FaLock } from 'react-icons/fa';
import { AiOutlineColumnWidth, AiOutlineColumnHeight , AiOutlineFontSize, AiOutlineItalic} from 'react-icons/ai';

export const itemDefaultProps = {
  width: 100,
  height: 100,
  posX: 50,
  posY: 50,
  rotate: 0,
  fontsize:14
};

export const moduleDefaultProps = {
  bordercolor: 'transparent',
  bordersize: '0',
  bordertype: 'none',
};

export const moduleParams = {
  image : {
    file : {
      parts : [
        {
          slug : "file",
          label: "Charger l'image",
          name : BiImageAdd,
          type : "image"
        }
      ]
    },
    preserveratio: {
      parts: [
        {
          slug: 'preserveratio',
          label: "Garder le ratio",
          type: 'bool',
          name: BsAspectRatio,
          defaultvalue : true
        },
      ],
    },
    locksize : {
      parts: [
        {
          slug: 'locksize',
          type: 'bool',
          name: FaLock,
          defaultvalue : true
        },
      ],
    },
  },
  textzone: {
    textcolor: {
      parts: [
        {
          slug: 'textcolor',
          name: BiFontColor,
          label: "Couleur du texte",
          type: 'color',
          defaultvalue: '#000',
        },
      ],
    },
    backgroundcolor: {
      parts: [
        {
          slug: 'backgroundcolor',
          name: MdFormatColorFill,
          label: "Couleur de fond",
          type: 'color',
          defaultvalue: '#fff',
        },
      ],
    },
    content : {
      parts : [
        {
          slug : "content",
          label: "Contenu",
          name : BsTextarea,
          type : ""
        }
      ]
    },
    fontsize : {
      parts : [
        {
          slug : "fontsize",
          label: "Taille de la police",
          name : AiOutlineFontSize,
          type : "number",
          defaultvalue:'10px'
        }
      ]
    },
    fontfamily : {
      parts : [
        {
          slug : "fontfamily",
          label: "Police",
          name : BsFonts,
          type: 'select',
          values: [
            'Arial',
            'Open Sans',
          ],
          defaultvalue:"Roboto"
        }
      ]
    },
    fontstyle: {
      parts: [
        {
          slug: 'fontstyle',
          name: AiOutlineItalic,
          label: "Italique",
          type: 'bool',
          defaultvalue:false
        },
      ],
    },
    fontweight: {
      parts: [
        {
          slug: 'fontweight',
          name: BiBold,
          label: "Gras",
          type: 'bool',
          defaultvalue:false
        },
      ],
    },
  },
};

export const global = {
  size: {
    parts: [
      {
        slug: 'width',
        name: AiOutlineColumnWidth,
        label: "Largeur",
        type: 'number',
        min: 0,
      },
      {
        slug: 'height',
        name: AiOutlineColumnHeight,
        label: "Hauteur",
        type: 'number',
        min: 0,
      },
    ],
  },
  rotate: {
    parts: [
      {
        slug: 'rotate',
        name: FiRotateCcw,
        label: "Rotation (deg)",
        type: 'number',
      },
    ],
  },
  backgroundcolor: {
    parts: [
      {
        slug: 'backgroundcolor',
        name: MdFormatColorFill,
        label: "Couleur de fond",
        type: 'color',
        defaultvalue: '#000',
      },
    ],
  },
  border: {
    parts: [
      {
        slug: 'bordersize',
        type: 'number',
        label: "Epaisseur de la bordure",
        max: 10,
        name: BsBorderWidth,
        type: 'number',
      },
      {
        slug: 'bordercolor',
        label: "Couleur de la bordure",
        name: MdBorderColor,
        type: 'color',
        defaultvalue: '#fff',
      },
      {
        slug: 'bordertype',
        name: BsBorderStyle,
        label: "Type de bordure",
        type: 'select',
        values: [
          'none',
          'solid',
          'dashed',
          'dotted',
          'double',
          'groove',
          'ridge',
          'inset',
          'outset',
        ],
      },
    ],
  },
  preserveratio: {
    parts: [
      {
        slug: 'preserveratio',
        label: "Garder le ratio",
        type: 'bool',
        name: BsAspectRatio,
      },
    ],
  },
};
