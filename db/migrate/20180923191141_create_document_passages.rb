class CreateDocumentPassages < ActiveRecord::Migration[5.2]
  def change
    create_table :document_passages do |t|
      t.integer :document_id
      t.integer :passage_id

      t.timestamps
    end
  end
end
