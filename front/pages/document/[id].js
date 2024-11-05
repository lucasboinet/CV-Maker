import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import styles from '@/styles/DocumentPage.module.scss';
import ParamsBar from '@/components/ParamsBar/ParamsBar';
import { global, moduleParams } from '@/Utils';
import itemStyles from '@/components/Item/Item.module.scss';
import resizeStyles from '@/components/ResizeOverlay/ResizeOverlay.module.scss';
import Cercle from '@/components/Modules/Cercle';
import Carre from '@/components/Modules/Carré';
import Textzone from '@/components/Modules/Textzone';
import Item from '@/components/Item/Item';
import ModulesBar from '@/components/Modules/ModulesBar/ModulesBar';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import axios from 'axios';
import ExportPDF from '@/components/ExportPDF/ExportPDF';
import { toJpeg } from 'html-to-image';
import Image from '@/components/Modules/Image';
import { v4 as uuidv4 } from 'uuid';
import { useAuthState } from '@/context/Auth';
import PageLayout from '@/components/Layout/PageLayout';

const DocumentPage = ({ id }) => {
  const [itemSelected, setItemSelected] = useState(null);
  const [colorPicker, setColorPicker] = useState(null);
  const [project, setProject] = useState(null);
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const zoomContext = useRef();
  const timeout = useRef();
  const previewTimeout = useRef();
  const printElement = useRef();
  const [{ user }] = useAuthState();

  const moveItem = useCallback(
    (id, posX, posY) => {
      setItems((old) =>
        old.map((e) => (e.id === id ? { ...e, posX, posY } : e))
      );
    },
    [items, setItems]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'image',
      hover: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        const scale = zoomContext.current.state?.scale || 1;
        const left = Math.round(item.posX + delta.x / scale);
        let top = Math.round(item.posY + delta.y / scale);

        return moveItem(item.id, left, top);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [moveItem]
  );

  useEffect(() => {
    fetchCurrentProjectData();
  }, []);

  const setScale = (value) => {
    return new Promise((resolve) => {
      zoomContext.current.centerView(value, 200, 'easeOut');
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  };

  useEffect(() => {
    if (project) {
      debounceUpdate();
      debounceUpdatePreview();
    }
  }, [items]);

  const debounceUpdate = () => {
    clearTimeout(timeout.current);
    setIsSaving(false);
    timeout.current = setTimeout(async () => {
      const images = items.filter(
        (i) => i.type === 'image' && i.file && i.file.constructor === File
      );
      const uploadedImages = images.map(async (item) => {
        const data = new FormData();
        data.append('id', item.id);
        data.append('ext', '');
        data.append('file', item.file);
        data.append('folder', `${user._id}/${project._id}/images`);

        await axios
          .post(process.env.NEXT_PUBLIC_SERVER_URL + '/projects/images', data)
          .then((res) => {
            updateItem({ ...item, file: res.data.url });
          });
      });

      await Promise.all(uploadedImages);

      axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + '/projects/update', {
          items,
          id: project._id,
        })
        .then(() => {
          setIsSaving(false);
          console.log('updated project');
        });
    }, 5000);
    setIsSaving(true);
  };

  const debounceUpdatePreview = () => {
    clearTimeout(previewTimeout.current);
    previewTimeout.current = setTimeout(() => {
      const sheetElement = document.querySelector('#pdf');
      if (sheetElement && user) {
        toJpeg(sheetElement).then(async (imgUrl) => {
          const file = await urltoFile(imgUrl, `${project._id}-preview.jpeg`);
          const data = new FormData();
          data.append('id', project._id);
          data.append('ext', '.jpeg');
          data.append('file', file);
          data.append('folder', `${user._id}/${project._id}`);
          data.append('updatePreview', true);

          axios.post(
            process.env.NEXT_PUBLIC_SERVER_URL + '/projects/images',
            data
          );
        });
      }
    }, 10000);
  };

  const urltoFile = (url, filename) => {
    return fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], filename, { type: 'image/jpeg' }));
  };

  const fetchCurrentProjectData = async () => {
    await axios
      .get(process.env.NEXT_PUBLIC_SERVER_URL + '/projects/' + id)
      .then((res) => {
        if (res.data.project?.body.length > 0) {
          const fetchedItems = JSON.parse(res.data.project?.body).map((i) => {
            i.module = getLinkedModule(i.type);
            return i;
          });
          setItems(fetchedItems ?? []);
        }
        setProject(res.data.project);
      })
      .catch((err) => console.error(err));
  };

  const addItemToSheet = (item) => {
    const id = uuidv4();
    setItems((old) => [...old, { ...item, id }]);
    toggleSelectedItem({ ...item, id });
  };

  const updateItem = (item) => {
    setItems((old) =>
      old.map((e) => (e.id === item.id ? { ...e, ...item } : e))
    );
    setItemSelected((old) => ({ ...old, ...item }));
  };

  const deleteSelectedItem = (e) => {
    if (itemSelected !== null && e.key === 'Delete') {
      if (itemSelected.type === 'image') {
        const folder = `${user._id}/${project._id}/images`;
        axios.post(
          process.env.NEXT_PUBLIC_SERVER_URL + '/projects/images/delete',
          { id: itemSelected.id, folder }
        );
      }
      setItems((old) =>
        old.filter((element) => element.id !== itemSelected.id)
      );
      toggleSelectedItem(null);
    }
  };

  const toFore = ({ id }) => {
    const index = items.findIndex((e) => e.id === id);
    if (index < items.length - 1) {
      setItems((old) => {
        const element = old[index];
        let newItems = [...old];
        newItems[index] = old[index + 1];
        newItems[index + 1] = element;
        return newItems;
      });
    }
  };

  const toBack = ({ id }) => {
    const index = items.findIndex((e) => e.id === id);
    if (index > 0) {
      setItems((old) => {
        const element = old[index];
        let newItems = [...old];
        newItems[index] = old[index - 1];
        newItems[index - 1] = element;
        return newItems;
      });
    }
  };

  const toggleSelectedItem = (value) => {
    setColorPicker(null);
    setItemSelected(value);
  };

  const getLinkedModule = (type) => {
    switch (type) {
      case 'carre':
        return Carre;
      case 'cercle':
        return Cercle;
      case 'textzone':
        return Textzone;
      case 'image':
        return Image;
    }
  };

  return (
    <PageLayout>
      <div className={styles.dnd}>
        <div className={styles.save_buttons}>
          <button disabled>{isSaving ? 'Saving...' : 'Saved'}</button>
          <ExportPDF
            items={items}
            setItems={setItems}
            setItemSelected={toggleSelectedItem}
            elementToSave="#pdf"
            setScale={setScale}
            projectName={project?.name}
          />
        </div>
        <ModulesBar
          getLinkedModule={getLinkedModule}
          addItemToSheet={addItemToSheet}
          itemsSize={items.length}
          colorPicker={colorPicker}
          updateItem={updateItem}
          item={itemSelected}
        />
        {itemSelected != null && (
          <ParamsBar
            item={itemSelected}
            updateItem={updateItem}
            toggleColorPicker={(data) =>
              setColorPicker(colorPicker ? null : data)
            }
            toFore={toFore}
            toBack={toBack}
          />
        )}
        <TransformWrapper
          ref={zoomContext}
          initialScale={0.7}
          minScale={0.2}
          wheel={{
            step: 0.1,
          }}
          pinch={{
            step: 3,
          }}
          centerZoomedOut={false}
          centerOnInit={true}
          limitToBounds={false}
          doubleClick={{
            excluded: [itemStyles['drag-overlay']],
          }}
          panning={{
            disabled: false,
            velocityDisabled: true,
            excluded: [
              itemStyles['item'],
              itemStyles['drag-overlay'],
              itemStyles['item-content'],
              resizeStyles['resizer'],
              resizeStyles['rotate'],
            ],
          }}
        >
          <div className={styles.zoomWrapper}>
            <TransformComponent className={styles.transformComponent}>
              <div className={styles.sheetWrapper} ref={printElement}>
                <p className={styles.sheetTitle}>{project?.name}</p>
                <div
                  id="pdf"
                  className={styles.sheet}
                  ref={drop}
                  onClick={() => toggleSelectedItem(null)}
                  tabIndex="0"
                  onKeyDown={deleteSelectedItem}
                  style={{ backgroundColor: '#fff' }}
                >
                  {items.map((item, index) => {
                    let itemParams = {};
                    Object.values({
                      ...global,
                      ...moduleParams[item.type],
                    }).map(({ parts }) =>
                      parts.map(
                        (part) =>
                          (itemParams[part.slug] =
                            item[part.slug] ?? part.defaultvalue)
                      )
                    );
                    return (
                      <Item
                        updating={
                          itemSelected != null && itemSelected.id === item.id
                        }
                        key={index}
                        id={item.id}
                        module={item.module}
                        type={item.type}
                        width={item.width}
                        height={item.height}
                        posX={item.posX || 0}
                        posY={item.posY || 0}
                        rotate={item.rotate}
                        preserveratio={item.preserveratio}
                        moduleParams={itemParams}
                        selectItem={() => toggleSelectedItem(item)}
                        unselectItem={() => toggleSelectedItem(null)}
                        updateItem={(item) => updateItem(item)}
                      />
                    );
                  })}
                </div>
              </div>
            </TransformComponent>
          </div>
        </TransformWrapper>
      </div>
    </PageLayout>
  );
};

DocumentPage.getInitialProps = ({ query }) => {
  return query;
};

export default DocumentPage;
