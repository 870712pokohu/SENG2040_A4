from django import forms
from .models import Profile

class ProfileForm(forms.ModelForm):

  bio = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control'}))
  # avatar = forms.CharField(widget=forms.FileInput(attrs={'class': 'form-control'}))

  class Meta:
    model = Profile
    fields = ('bio', 'avatar',)