import streamlit as st
import cv2
import numpy as np
import tempfile
import time
import os
import sys
print(sys.version)
import cv2
print(cv2.__version__)


def get_duration(selection, custom_input):
    """Determina la duración basada en la opción seleccionada o el valor personalizado."""
    return float(custom_input) if custom_input else float(selection)

def create_panning_transition(before_img, after_img, output_path, before_duration, transition_duration, after_duration, fps=30):
    img1 = cv2.imread(before_img)
    img2 = cv2.imread(after_img)
    height, width = img1.shape[:2]

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    frames_before = int(fps * before_duration)
    frames_transition = int(fps * transition_duration)
    frames_after = int(fps * after_duration)

    for _ in range(frames_before):
        out.write(img1)
    for i in range(frames_transition):
        alpha = i / frames_transition
        blended = cv2.addWeighted(img1, 1 - alpha, img2, alpha, 0)
        out.write(blended)
    for _ in range(frames_after):
        out.write(img2)
    
    out.release()

def main():
    st.title("Image Transition Web App")
    
    before_file = st.file_uploader("Selecciona la imagen de ANTES", type=["png", "jpg", "jpeg"])
    after_file = st.file_uploader("Selecciona la imagen de DESPUÉS", type=["png", "jpg", "jpeg"])
    
    before_duration = st.text_input("Duración del 'Antes' (segundos)", "1")
    transition_duration = st.text_input("Duración de la Transición (segundos)", "1")
    after_duration = st.text_input("Duración del 'Después' (segundos)", "1")
    custom_name = st.text_input("Nombre personalizado para el archivo (opcional)")
    
    if st.button("Generar Transición"):
        if before_file and after_file:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_before:
                temp_before.write(before_file.read())
                before_path = temp_before.name
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_after:
                temp_after.write(after_file.read())
                after_path = temp_after.name
            
            output_name = f"{custom_name}_transition.mp4" if custom_name else f"transition_{int(time.time())}.mp4"
            output_path = os.path.join(tempfile.gettempdir(), output_name)
            
            try:
                create_panning_transition(before_path, after_path, output_path, 
                                          get_duration(before_duration, ""), 
                                          get_duration(transition_duration, ""), 
                                          get_duration(after_duration, ""))
                
                st.success("Transición generada con éxito!")
                st.video(output_path)
            except Exception as e:
                st.error(f"Error al generar el video: {e}")
        else:
            st.warning("Por favor, sube ambas imágenes antes de generar la transición.")

if __name__ == "__main__":
    main()
