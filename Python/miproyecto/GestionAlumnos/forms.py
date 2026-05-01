from django import forms
from .models import Estudiante

class InscripcionForm(forms.ModelForm):
    class Meta:
        model = Estudiante
        fields = ['nombre', 'cedula', 'materias']
        # Usamos widgets para aplicar clases de Bootstrap y mejorar el diseño
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control'}),
            'cedula': forms.TextInput(attrs={'class': 'form-control'}),
            'materias': forms.SelectMultiple(attrs={'class': 'form-control'}),
        }