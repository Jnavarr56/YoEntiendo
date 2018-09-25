json.extract! document, :id, :title, :author_user_id, :created_at, :updated_at
json.url document_url(document, format: :json)
