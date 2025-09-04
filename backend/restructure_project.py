#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

def restructure_project():
    # Define the current and target directory structure
    base_dir = Path.cwd()
    app_dir = base_dir / "app"
    
    # Create new directories
    directories = [
        "models",
        "schemas",
        "routers",
        "dependencies",
        "core",
        "services",
        "utils"
    ]
    
    for directory in directories:
        (app_dir / directory).mkdir(exist_ok=True)
        (app_dir / directory / "__init__.py").touch(exist_ok=True)
    
    # Move and reorganize files
    # Move db files
    if (app_dir / "db").exists():
        shutil.move(str(app_dir / "db" / "db.py"), str(app_dir / "core" / "database.py"))
        shutil.move(str(app_dir / "db" / "deps.py"), str(app_dir / "dependencies" / "deps.py"))
        shutil.rmtree(str(app_dir / "db"))
    
    # Move models
    if (app_dir / "models.py").exists():
        shutil.move(str(app_dir / "models.py"), str(app_dir / "models" / "user.py"))
    
    # Move schemas
    if (app_dir / "schemas.py").exists():
        shutil.move(str(app_dir / "schemas.py"), str(app_dir / "schemas" / "user.py"))
    
    # Move security
    if (app_dir / "security.py").exists():
        shutil.move(str(app_dir / "security.py"), str(app_dir / "core" / "security.py"))
    
    # Move config
    if (app_dir / "config.py").exists():
        shutil.move(str(app_dir / "config.py"), str(app_dir / "core" / "config.py"))
    
    # Move routers
    if (app_dir / "routers").exists():
        for router_file in (app_dir / "routers").glob("*.py"):
            if router_file.name != "__init__.py":
                shutil.move(str(router_file), str(app_dir / "routers" / router_file.name))
    
    # Create __init__.py files with proper imports
    with open(app_dir / "models" / "__init__.py", "w") as f:
        f.write("from .user import User\n")
    
    with open(app_dir / "schemas" / "__init__.py", "w") as f:
        f.write("from .user import *\n")
    
    with open(app_dir / "core" / "__init__.py", "w") as f:
        f.write("from .config import settings\n")
        f.write("from .database import Base, engine, get_db\n")
        f.write("from .security import *\n")
    
    # Update imports in files
    update_imports(app_dir)
    
    print("Project restructuring completed successfully!")

def update_imports(app_dir):
    # Update imports in all Python files
    for root, dirs, files in os.walk(app_dir):
        for file in files:
            if file.endswith(".py"):
                file_path = Path(root) / file
                update_file_imports(file_path, app_dir)

def update_file_imports(file_path, app_dir):
    with open(file_path, "r") as f:
        content = f.read()
    
    # Replace imports
    content = content.replace("from ..db import", "from app.core.database import")
    content = content.replace("from ..db.db import", "from app.core.database import")
    content = content.replace("from ..db.deps import", "from app.dependencies.deps import")
    content = content.replace("from .. import models", "from app.models import")
    content = content.replace("from ..models import", "from app.models import")
    content = content.replace("from .. import schemas", "from app.schemas import")
    content = content.replace("from ..schemas import", "from app.schemas import")
    content = content.replace("from ..security import", "from app.core.security import")
    content = content.replace("from ..config import", "from app.core.config import")
    
    with open(file_path, "w") as f:
        f.write(content)

if __name__ == "__main__":
    restructure_project()