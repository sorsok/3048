FROM python
WORKDIR /code
RUN pip install pipenv
COPY ./Pipfile* ./
RUN pipenv install --system
COPY . .
CMD [ "python" ]