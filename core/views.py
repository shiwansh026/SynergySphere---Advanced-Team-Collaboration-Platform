from django.shortcuts import render
from django.contrib.auth import authenticate, login as auth_login

# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .models import Project, Task, Profile


# Index (Landing Page)
def index(request):
    return render(request, "index.html")




from django.contrib.auth import authenticate, login as auth_login
def login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            auth_login(request, user)
            return redirect("dashboard")
        else:
            return render(request, "login.html", {"error": "Invalid credentials"})
    return render(request, "login.html")

def signup(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        if User.objects.filter(username=username).exists():
            return render(request, "signup.html", {"error": "Username already exists"})
        user = User.objects.create_user(username=username, email=email, password=password)
        Profile.objects.create(user=user)
        auth_login(request, user)  # use auth_login here
        return redirect("dashboard")
    return render(request, "signup.html")

# Logout
def logout(request):
    logout(request)
    return redirect("index")


from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Project, Task

@login_required
def dashboard(request):
    all_projects = Project.objects.filter(created_by=request.user)
    all_tasks = Task.objects.filter(project__created_by=request.user)

    projects = all_projects.order_by("-created_at")[:5]
    tasks = all_tasks.order_by("-created_at")[:5]

    context = {
        "total_projects": all_projects.count(),
        "total_tasks": all_tasks.count(),
        "completed_tasks": all_tasks.filter(status='completed').count(),
        "pending_tasks": all_tasks.filter(status='pending').count(),
        "projects": projects,
        "tasks": tasks,
    }
    return render(request, "dashboard.html", context)

# Profile Page
@login_required
def profile(request):
    profile = get_object_or_404(Profile, user=request.user)
    return render(request, "profile.html", {"profile": profile})


# Project Detail
@login_required
def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id, created_by=request.user)
    tasks = project.tasks.all()
    return render(request, "project-detail.html", {"project": project, "tasks": tasks})


from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .form import ProjectForm

from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.shortcuts import render, redirect
from .form import ProjectForm

@login_required
def add_project(request):
    if not request.user.is_superuser:
        return HttpResponseForbidden("You do not have permission to add projects.")

    if request.method == "POST":
        form = ProjectForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            project.created_by = request.user
            project.save()
            return redirect("dashboard")
    else:
        form = ProjectForm()
    return render(request, "add_project.html", {"form": form})


